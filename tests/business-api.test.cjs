const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');
const base = path.join(__dirname, '../apps/lab/src/services/api');
const modules = {};
const records = new Map();
const calls = [];
let nextId = 1;
const client = { apiRequest: async (url, options = {}) => {
  calls.push({url, options});
  const [route, query] = url.split('?');
  const id = new URLSearchParams(query).get('id');
  const input = options.body ? JSON.parse(options.body) : undefined;
  if (options.method === 'POST') {
    const prefix = route === '/clients' ? 'cli' : route === '/formulas' ? 'form' : 'prod';
    const data = { ...input, id: prefix + '-' + String(nextId++).padStart(16, '0') };
    records.set(data.id, data); return data;
  }
  if (options.method === 'PUT') { const data = {...records.get(id), ...input}; records.set(id,data); return data; }
  if (options.method === 'DELETE') { records.delete(id); return {id, deleted: true}; }
  return id ? records.get(id) : [...records.values()].filter(row => row.id.startsWith(route === '/clients' ? 'cli-' : route === '/formulas' ? 'form-' : 'prod-'));
}};
function load(name) {
  if (name === './client') return client;
  if (modules[name]) return modules[name];
  const filename = path.join(base, name.replace('./', '') + '.ts');
  const code = ts.transpileModule(fs.readFileSync(filename,'utf8'), {compilerOptions: {module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  const module = {exports:{}};
  vm.runInNewContext(code, {exports:module.exports, module, require:load, URLSearchParams, Error, RegExp});
  return modules[name] = module.exports;
}
const clients = load('./clients');
const formulas = load('./formulas');
const products = load('./catalogProducts');
test('client create, update, duplicate, reload mapping and delete call real services', async () => {
  const created = await clients.createClientApi({name:'Shop',phone:'+123',type:'Boutique',email:null,address:null,notes:null,status:'Activo',lastOrderDate:null});
  assert.equal(created.email, undefined);
  await clients.updateClientApi(created.id, {name:'Updated'});
  const duplicate = await clients.createClientApi({...created,name:'Copy'});
  assert.notEqual(created.id,duplicate.id);
  assert.equal((await clients.getClientByIdApi(created.id)).name,'Updated');
  assert.equal((await clients.getClientsApi()).length,2);
  await clients.deleteClientApi(created.id);
  assert.equal((await clients.getClientsApi()).length,1);
});
test('formula mapper preserves server yield, snapshots and costs', () => {
  const mapped = formulas.mapFormulaApiDto({id:'form-1111111111111111',name:'Wax',category:'Vela',yieldSize:'200 g',yieldUnits:'10',batchSizeGrams:'2000',status:'Borrador',version:'v1',notes:null,topNotes:[],heartNotes:[],baseNotes:[],suggestedMarginPercent:'65',processMaxMeltingTemp:null,processFragranceTemp:null,processPouringTemp:null,processCuringDays:null,processNotes:null,totalCostARS:'58000',unitCostARS:'5800',ingredients:[{ingredientId:null,ingredientName:'Snapshot',category:'Ceras',quantity:'1',unit:'g',percentage:'100',unitCostARS:'58000',supplierId:null,supplierName:null,calculatedCostARS:'58000'}]});
  assert.equal(mapped.yieldUnits,10); assert.equal(mapped.totalCostARS,58000); assert.equal(mapped.unitCostARS,5800);
  assert.equal(mapped.ingredients[0].ingredientName,'Snapshot'); assert.equal(mapped.ingredients[0].ingredientId,'');
});
test('catalog mapper preserves approved and suggested prices independently', () => {
  const mapped = products.mapProductApiDto({id:'prod-1111111111111111',sku:'SKU',name:'Candle',category:'Vela',description:'',shortDescription:'',collection:'',fragranceFamily:'',status:'Activo',formulaId:null,formulaName:null,imageUrl:null,images:[],badge:null,topNotes:null,heartNotes:null,baseNotes:null,variants:[{id:'var-1111111111111111',sku:'VAR',size:'200 g',unit:'unid',aroma:'Wax',salePriceARS:'180',estimatedCostARS:'100',suggestedSalePriceARS:'165',marginPercent:'65',status:'Activo'}]});
  assert.equal(mapped.formulaId,undefined); assert.equal(mapped.variants[0].salePriceARS,180); assert.equal(mapped.variants[0].suggestedSalePriceARS,165); assert.equal(mapped.variants[0].estimatedCostARS,100);
});
test('demo IDs and demo linked IDs never reach fetch', async () => {
  const before=calls.length;
  await assert.rejects(clients.deleteClientApi('cli-demo'));
  await assert.rejects(formulas.updateFormulaApi('form-demo',{name:'X'}));
  await assert.rejects(products.deleteProductApi('prod-demo'));
  await assert.rejects(formulas.createFormulaApi({ingredients:[{ingredientId:'ing-demo'}]}));
  await assert.rejects(products.createProductApi({formulaId:'form-demo'}));
  await assert.rejects(clients.createClientApi({id:'cli-demo',name:'Demo',phone:'+123',type:'Boutique'}));
  assert.equal(calls.length,before);
});
test('write DTOs strip local IDs and authoritative costs, and send explicit formula unlink', async () => {
  await formulas.createFormulaApi({name:'Formula',ingredients:[{ingredientId:'ing-1111111111111111',quantity:10,percentage:100,unitCostARS:999,calculatedCostARS:999,ingredientName:'Fake'}],totalCostARS:999,unitCostARS:999});
  let sent=JSON.parse(calls.at(-1).options.body);
  assert.equal(sent.totalCostARS,undefined); assert.equal(sent.unitCostARS,undefined);
  assert.deepEqual(sent.ingredients,[{ingredientId:'ing-1111111111111111',quantity:10,percentage:100}]);
  await products.createProductApi({name:'Product',sku:'P',formulaId:undefined,variants:[{id:'var-local',sku:'V',size:'200 g',unit:'unid',aroma:'Wax',salePriceARS:100,estimatedCostARS:50,suggestedSalePriceARS:999,status:'Activo'}]});
  sent=JSON.parse(calls.at(-1).options.body);
  assert.equal(sent.formulaId,null); assert.equal(sent.variants[0].id,undefined); assert.equal(sent.variants[0].suggestedSalePriceARS,undefined);
});
test('localStorage writer retains only the allowed temporary entities', () => {
  const context=fs.readFileSync(path.join(__dirname,'../apps/lab/src/context/KameloContext.tsx'),'utf8');
  const persisted=context.split('const stateToSave = {')[1].split('};')[0];
  assert.deepEqual(persisted.split(',').map(x=>x.trim()).filter(Boolean),['requirements','batchTests','marketQueries','marketBenchmarks','activityLogs']);
  assert.doesNotMatch(context,/parsed\.(clients|formulas|catalogProducts)/);
});

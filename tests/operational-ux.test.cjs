const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
function load(file, globals = {}, deps = {}) {
  const code = ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  const module = {exports:{}};
  vm.runInNewContext(code, {module,exports:module.exports,require: name => { if (name in deps) return deps[name]; throw new Error(name); }, ...globals});
  return module.exports;
}
test('canonical launcher exposes exactly six ordered actions reused on mobile', () => {
  const {creationActions} = load('apps/lab/src/components/creationActions.ts');
  assert.equal(JSON.stringify(creationActions.map(a=>a.label)),JSON.stringify(['Cliente','Proveedor','Insumo','Compra','Fórmula','Producto']));
  const nav = fs.readFileSync(path.join(root,'apps/lab/src/components/Navigation.tsx'),'utf8');
  assert.equal((nav.match(/creationActions.map/g)||[]).length,2);
  const quick = fs.readFileSync(path.join(root,'apps/lab/src/components/QuickModals.tsx'),'utf8');
  assert.match(quick,/activeModal === 'client'.*ClientEditor/);
  assert.match(quick,/activeModal === 'ingredient'.*IngredientEditor/);
});
test('cost preview handles dimensions and invalid quantities', () => {
  const {ingredientCostPreview:cost} = load('apps/lab/src/utils/ingredientUnits.ts');
  assert.equal(cost(42500,5,'kg','g'),8.5);
  assert.equal(cost(120000,1,'l','ml'),120);
  assert.equal(cost(12000,100,'unid','unid'),120);
  for (const pair of [['kg','ml'],['l','g'],['unid','g'],['%','%']]) assert.equal(cost(1,1,...pair),null);
  assert.equal(cost(1,0,'g','g'),null);
});
test('ingredient mapper exposes purchaseUnit and safely falls back on legacy records', () => {
  const api = load('apps/lab/src/services/api/ingredients.ts',{}, {'./client':{}});
  const dto = {unit:'g',purchaseUnit:'kg',purchasePriceARS:42500,referenceQty:5,unitCostARS:8.5,stock:0,minStock:0};
  assert.equal(api.mapIngredientApiDto(dto).purchaseUnit,'kg');
  delete dto.purchaseUnit;
  assert.equal(api.mapIngredientApiDto(dto).purchaseUnit,'g');
});
test('multipart image service handles success, validation, malformed envelope, HTTP and network errors', async () => {
  class ApiError extends Error { constructor(code,message,status) {super(message);this.code=code;this.status=status;} }
  const url = '/dev/api/uploads/images/img-'+'a'.repeat(48)+'.png';
  let response, captured;
  const media = load('apps/lab/src/services/api/media.ts', {FormData,fetch:async (endpoint,options)=>{captured={endpoint,options};if(response instanceof Error)throw response;return response;}}, {'./client':{ApiError,getApiBaseUrl:()=>'/dev/api'}});
  response = {ok:true,status:201,json:async()=>({success:true,data:{url}})};
  const result = await media.uploadImageApi(new Blob(['test'],{type:'image/png'}));
  assert.equal(result.url,url); assert.equal(captured.endpoint,'/dev/api/media');
  assert.equal(captured.options.headers,undefined); assert.ok(captured.options.body instanceof FormData);
  assert.ok(captured.options.body.get('file') instanceof Blob);
  response={ok:false,status:400,json:async()=>({success:false,error:{code:'VALIDATION_ERROR',message:'Solo imágenes'}})};
  await assert.rejects(media.uploadImageApi(new Blob()),e=>e.code==='VALIDATION_ERROR' && e.message==='Solo imágenes');
  response={ok:true,status:200,json:async()=>({success:true,data:{url:'bad'}})};
  await assert.rejects(media.uploadImageApi(new Blob()),e=>e.code==='INVALID_RESPONSE');
  response={ok:true,status:200,json:async()=>({data:{url}})};
  await assert.rejects(media.uploadImageApi(new Blob()),e=>e.code==='INVALID_RESPONSE');
  response={ok:false,status:413,json:async()=>{throw new Error('HTML');}};
  await assert.rejects(media.uploadImageApi(new Blob()),e=>e.code==='INVALID_RESPONSE' && e.status===413);
  response=new Error('offline');
  await assert.rejects(media.uploadImageApi(new Blob()),e=>e.code==='NETWORK_ERROR');
});

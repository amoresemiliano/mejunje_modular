<?php
require_once __DIR__ . '/../validation.php';
require_once __DIR__ . '/../media-validation.php';
$passed = 0;
function check($condition, $label) { global $passed; if (!$condition) throw new RuntimeException($label); $passed++; echo "PASS $label\n"; }
function rejects(callable $fn, $label) { try { $fn(); } catch (InvalidArgumentException $e) { check(true, $label); return; } throw new RuntimeException("Expected rejection: $label"); }
check(ingredientUnitCost(['purchasePriceARS'=>42500,'referenceQty'=>5,'purchaseUnit'=>'kg','unit'=>'g']) === 8.5, '5 kg to g = 8.5 ARS/g');
check(ingredientUnitCost(['purchasePriceARS'=>120000,'referenceQty'=>1,'purchaseUnit'=>'l','unit'=>'ml']) === 120.0, '1 l to ml = 120 ARS/ml');
check(ingredientUnitCost(['purchasePriceARS'=>12000,'referenceQty'=>100,'purchaseUnit'=>'unid','unit'=>'unid']) === 120.0, 'count = 120 ARS/unid');
foreach ([['kg','ml'],['l','g'],['unid','g'],['unid','ml'],['%','%']] as $pair) rejects(fn()=>convertIngredientQuantity(1,$pair[0],$pair[1]), implode(' to ', $pair));
rejects(fn()=>ingredientUnitCost(['purchasePriceARS'=>1,'referenceQty'=>0,'purchaseUnit'=>'g','unit'=>'g']), 'zero quantity');
foreach ([['g','kg',0.001],['kg','kg',1.0],['g','g',1.0],['ml','l',0.001],['l','l',1.0],['ml','ml',1.0]] as $conversion) check(convertIngredientQuantity(1,$conversion[0],$conversion[1]) === $conversion[2], 'conversion '.implode(' ', $conversion));
$existing = ['purchase_price_ars'=>42500,'reference_qty'=>5,'purchase_unit'=>'kg','unit'=>'g'];
check(ingredientUnitCost(['purchasePriceARS'=>85000],$existing) === 17.0, 'partial price recalculation');
check(ingredientUnitCost(['referenceQty'=>10],$existing) === 4.25, 'partial quantity recalculation');
check(ingredientUnitCost(['purchaseUnit'=>'g'],$existing) === 8500.0, 'partial purchase unit recalculation');
check(ingredientUnitCost(['unit'=>'kg'],$existing) === 8500.0, 'partial consumption unit recalculation');
check(ingredientUnitCost(['unitCostARS'=>999999],$existing) === 8.5, 'client cost ignored');
rejects(fn()=>ingredientUnitCost(['unit'=>'ml'],$existing), 'merged partial pair rejects mismatch');
check(count(validateIngredientInput(['unit'=>'%'],true)) > 0, 'new percentage stock unit rejected');
check(count(validateIngredientInput(['unit'=>'g','purchaseUnit'=>'kg'],true)) === 0, 'compatible pair validated');
check(count(validateIngredientInput(['unit'=>'ml','purchaseUnit'=>'kg'],true)) > 0, 'incompatible pair rejected by validation');
$tmp = tempnam(sys_get_temp_dir(), 'mejunje-image-');
try {
    $image = imagecreatetruecolor(2,2);
    foreach (['jpg'=>'imagejpeg','png'=>'imagepng','webp'=>'imagewebp'] as $ext=>$encoder) {
        $encoder($image,$tmp); clearstatcache(true,$tmp);
        check(validateImageFile($tmp,filesize($tmp)) === $ext, "$ext accepted by real MIME and structure");
    }
    imagedestroy($image);
    foreach (['<svg xmlns="http://www.w3.org/2000/svg"></svg>', '<?php echo 1;', 'MZ executable', 'not an image'] as $payload) {
        file_put_contents($tmp,$payload); clearstatcache(true,$tmp);
        rejects(fn()=>validateImageFile($tmp,filesize($tmp)), 'non-image / wrong MIME rejected');
    }
    file_put_contents($tmp, str_repeat('x', MEDIA_MAX_BYTES+1)); clearstatcache(true,$tmp);
    rejects(fn()=>validateImageFile($tmp,filesize($tmp)), '> 8 MB rejected');
    rejects(fn()=>validateImageFile($tmp,1), 'actual size enforced even if reported size forged');
    $image = imagecreatetruecolor(1,1); imagepng($image,$tmp); imagedestroy($image);
    file_put_contents($tmp,'<?php echo 1;',FILE_APPEND); clearstatcache(true,$tmp);
    rejects(fn()=>validateImageFile($tmp,filesize($tmp)), 'image with PHP appended rejected');
} finally { unlink($tmp); }
$a = mediaFilename('png'); $b = mediaFilename('png');
check($a !== $b && preg_match('/^img-[a-f0-9]{48}\.png$/D',$a), 'cryptographic generated filename');
check(mediaPublicUrl($a) === '/dev/api/uploads/images/'.$a, 'canonical public URL');
rejects(fn()=>mediaFilename('php'), 'controlled extension only');
echo "$passed passed\n";

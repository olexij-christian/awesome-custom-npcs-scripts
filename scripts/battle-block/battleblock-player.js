////////////////////////////////_______________///////////////////////////////////
//      Скрипт добавляет возможность ставить игроку блок на "blockTime" секунд(ы) (на клавишу "X" по умолчанию). Снижает только физическиий урон (Удары, выстрелы) При блокировании игрок замедляется.
//      Версия - 1.0.2                   	Автор - EVGENmr
//	Благодарности: Артём Артёмов (The Moon) (за переделку кода в читабельный вид), Егор Денисенко (! TodayLife) (за пояснения в массивах).
//	Исправления нововведения: Добавлена опция сброса блока при получении урона. Добавлена опция снижения наносимого урона при блоке.
////////////////////////////////_______________///////////////////////////////////

// ID таймеров, которые можно менять.
var idtyt = 63;
var idtyta = 64;

var AttackInBlockCheck = true; // true - Включает проверку на атаку игрока и снижает урон на badAttack в процентах, false - игрок атакует без штрафов.
var checkNameItem = true; // true - Включает проверку на имя предмета, false - игрок может использовать блокирование по умолчанию.
var OneBlock = false; // true - При получении физического урона блокирование сбрасывается, false - Урон блокируется на определённый промежуток времени blockTime
var badAttack = 10; //% // При атаке в блоке будет нанесён врагу урон от общего урона в процентах.
var blockPercent = 0; //% // Полученный урон при блокировании в процентах.

var slowTime = 2; // Уровень замедления.
var blockTime = 2; // Время блока.
var blockCooldown = 2; // Время, через которое можно использовать блок.

var itemName = [  // Наименование требуемого предмета, при checkNameItem = true.
    "Меч",
    "Меч2",

];

var keyID = 45;

function keyPressed(e) {

    var itemL = e.player.getOffhandItem().getDisplayName();
    var itemR = e.player.getMainhandItem().getDisplayName();

    if (e.key == keyID) {
    
       if (checkNameItem) {
            if (!e.player.timers.has(idtyta)) {
                if (itemName.indexOf(itemL) > -1 || itemName.indexOf(itemR) > -1) {
                    e.player.message("Блок на 2 секунды");
                    e.player.addPotionEffect(2, blockTime, slowTime, 0);
                    e.player.timers.forceStart(idtyt, blockTime * 20, false);
                    e.player.timers.forceStart(idtyta, blockCooldown * 20, false);
                }
            }
        }

        else if (!e.player.timers.has(idtyta)) {
            e.player.message("Блок на 2 секунды");
            e.player.addPotionEffect(2, blockTime, slowTime, 0);
            e.player.timers.forceStart(idtyt, blockTime * 20, false);
            e.player.timers.forceStart(idtyta, blockCooldown * 20, false);
        }


    }
}

function damaged(e) {
    var undamage = [
        "fall",
        "anvil",
        "cactus",
        "dragonBreath",
        "drown",
        "fallingBlock",
        "flyIntoWall",
        "inFire",
        "inWall",
        "lava",
        "lightningBolt",
        "onFire",
        "outOfWorld",
        "starve",
        "wither",
        "magic",
    ];
if (OneBlock) {
if (undamage.indexOf(e.damageSource.getType()) == -1) {
        if (e.player.timers.has(idtyt)) {

            e.damage *= blockPercent / 100;
            e.player.swingOffhand();
            e.player.swingMainhand();
            e.player.world.playSoundAt(e.player.pos, 'minecraft:item.shield.block', 1, 1);
            e.player.timers.stop(idtyt);
            e.player.addPotionEffect(2, 0, 0, 0);
        }
    }
}
        else if (undamage.indexOf(e.damageSource.getType()) == -1) {
        if (e.player.timers.has(idtyt)) {

            e.damage *= blockPercent / 100;
            e.player.swingOffhand();
            e.player.swingMainhand();
            e.player.world.playSoundAt(e.player.pos, 'minecraft:item.shield.block', 1, 1);
        }
    }
}



function damagedEntity (e)  {
    if (AttackInBlockCheck) {
        if (e.player.timers.has(idtyt)) {
e.damage *= badAttack / 100;
        }
    }
}
function init(e) {
    e.player.timers.stop(idtyt);
    e.player.timers.stop(idtyta);
}

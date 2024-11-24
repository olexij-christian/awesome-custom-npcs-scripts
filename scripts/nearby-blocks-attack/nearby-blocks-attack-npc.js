var blockname = 'minecraft:redstone_torch'
var radius = 5 // Лучше не ставить больше 10.
var h1 = 6 // От какой высота относительно нпс идет скан блоков
var h2 = 6 // До какой высота относительно нпс идет скан блоков
var dmg = 1 // damage
function tick(e) {
    var x = e.npc.x
    var y = e.npc.y - 6
    var z = e.npc.z
    var rot
    var dx = -Math.sin(rot * Math.PI / 180)
    var dz = Math.cos(rot * Math.PI / 180)
    for (rot = 0; rot < 360; rot++) {
        for (y = e.npc.y - h1; y < e.npc.y + h2; y++) {
            for (var b = 0; b < radius; b++) {

                dx = -Math.sin(rot * Math.PI / 180)
                dz = Math.cos(rot * Math.PI / 180)
                //e.npc.world.spawnParticle('smoke',x+dx* b,y,z+dz* b,0,0,0,0,1) - визуальное отображение области скана, могут быть лаги
                if (e.npc.world.getBlock(x + dx * b, y, z + dz * b).getName() == blockname) {
                    e.npc.damage(dmg)
                }
            }
        }
    }
}
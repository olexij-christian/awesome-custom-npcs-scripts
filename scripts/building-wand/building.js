function Building(world) {
  var PARTICLE = "flame"
  var building = null
  return {

    initByJSON: function(json) {
      building = json
      return this
    },

    initByArea: function(pos1, pos2) {
      building = areaToBuilding(world, pos1, pos2)
      return this
    },

    initByName: function(name) {
      building = getBuilding(name)
      return this
    },

    build: function(pos) {
      if (!building)
        return false

      buildBuilding(world, pos, building)
      return true
    },

    save: function(name) {
      saveBuilding(name, building)
    },

    spawnParticle: function(pos) {
      if (!building)
        return false

      var x = building.size.x
      var y = building.size.y
      var z = building.size.z

      spawnParticleBy3DEdgeArea(world, PARTICLE, pos, pos.add(x, y, z))
      return true
    }

  }
}

function areaToBuilding(world, pos1, pos2) {
  var size_x = pos2.getX() - pos1.getX()
  var size_y = pos2.getY() - pos1.getY()
  var size_z = pos2.getZ() - pos1.getZ()

  var res = {}
  res.size = {
    x: size_x,
    y: size_y,
    z: size_z
  }

  for (var x = 0; smallerOrBigger(x, size_x); x += minusOrPlusOne(size_x)) {
    for (var y = 0; smallerOrBigger(y, size_y); y += minusOrPlusOne(size_y)) {
      for (var z = 0; smallerOrBigger(z, size_z); z += minusOrPlusOne(size_z)) {
        // cb - current block
        var cb_x = pos1.getX() + x
        var cb_y = pos1.getY() + y
        var cb_z = pos1.getZ() + z
        var current_block = world.getBlock(cb_x, cb_y, cb_z)
        res[x + "," + y + "," + z] =  [
          current_block.getName(),
          current_block.getMetadata()
        ]
      }
    }
  }

  return res

  function smallerOrBigger(vr, num) {
    if (num > 0)
      return vr <= num
    else
      return vr >= num
  }

  function minusOrPlusOne(num) {
    if (num > 0)
      return 1
    else
      return -1
  }

}

function buildBuilding(world, pos, building_json) {
  var pos_x = pos.getX()
  var pos_y = pos.getY()
  var pos_z = pos.getZ()
  var size = building_json.size
  for (var block_cor in building_json) {
    if (block_cor == "size")
      continue

    var cor = block_cor.split(',')
    var x = parseInt(cor[0]) + pos_x
    var y = parseInt(cor[1]) + pos_y
    var z = parseInt(cor[2]) + pos_z
    var block_name = building_json[block_cor][0]
    var block_meta = building_json[block_cor][1]
    world.setBlock(x, y, z, block_name, block_meta)
  }
}

function listBuildings() {
  var BUILDINGS_DIR_NAME = "buildings"
  var Api = Java.type("noppes.npcs.api.NpcAPI").Instance()
  var File = Java.type("java.io.File")
  var Files = Java.type("java.nio.file.Files")
  var PrintWriter = Java.type('java.io.PrintWriter')
  var FileWriter = Java.type('java.io.FileWriter')

  var world_dir = Api.getWorldDir()
  var buildings_dir = new File(world_dir, BUILDINGS_DIR_NAME)

  if (buildings_dir.exists() && buildings_dir.isDirectory()) {
    var res = []
    var file_list = buildings_dir.listFiles()

    for (var i in file_list) {
      var file = file_list[i]

      // NOTE: splitting to remove type of file
      // Example: "building.json" => "building"
      res.push(file.getName().split('.')[0])
    }

    return res
  } else return []

}

function saveBuilding(name, building_json) {
  var BUILDINGS_DIR_NAME = "buildings"
  var Api = Java.type("noppes.npcs.api.NpcAPI").Instance()
  var File = Java.type("java.io.File")
  var Files = Java.type("java.nio.file.Files")
  var PrintWriter = Java.type('java.io.PrintWriter')
  var FileWriter = Java.type('java.io.FileWriter')

  var world_dir = Api.getWorldDir()
  var buildings_dir = new File(world_dir, BUILDINGS_DIR_NAME)

  // mkdir
  if (buildings_dir.exists() == false)
    buildings_dir.mkdirs();

  var building_file_name = name + ".json"
  var building_file = new File(buildings_dir, building_file_name)
  var writer = new PrintWriter(new FileWriter(building_file, false));
  writer.println(JSON.stringify(building_json));
  writer.close();

}

function deleteBuilding(name) {
  var BUILDINGS_DIR_NAME = "buildings"
  var Api = Java.type("noppes.npcs.api.NpcAPI").Instance()
  var File = Java.type("java.io.File")
  var Files = Java.type("java.nio.file.Files")
  var Paths = Java.type("java.nio.file.Paths")

  var world_dir = Api.getWorldDir()
  var buildings_dir = new File(world_dir, BUILDINGS_DIR_NAME)

  if (buildings_dir.exists() == false)
    return false

  var building_file_name = name + ".json"
  var building_file = new File(buildings_dir, building_file_name)

  return building_file.delete()
}

function getBuilding(name) {
  var BUILDINGS_DIR_NAME = "buildings"
  var Api = Java.type("noppes.npcs.api.NpcAPI").Instance()
  var File = Java.type("java.io.File")
  var Files = Java.type("java.nio.file.Files")
  var Paths = Java.type("java.nio.file.Paths")

  var world_dir = Api.getWorldDir()
  var buildings_dir = new File(world_dir, BUILDINGS_DIR_NAME)

  if (buildings_dir.exists() == false)
    return null

  var building_file_name = name + ".json"
  var building_file = new File(buildings_dir, building_file_name)

  if ( building_file.exists() && building_file.isFile() ) {
    var building_file_path = Paths.get( building_file.getAbsolutePath() )
    var building_file_content = Files.readAllLines(building_file_path)[0]
    return JSON.parse(building_file_content)
  } else return null

}

function spawnParticleBy3DEdgeArea(world, particle, pos1, pos2) {
  var cor1 = {
    x: pos1.getX(),
    y: pos1.getY(),
    z: pos1.getZ()
  }
  var cor2 = {
    x: pos2.getX(),
    y: pos2.getY(),
    z: pos2.getZ()
  }

  // spawn particle for every edge

  // for z edges
  execute2DEdgeArea(function(x, y) {
    spawnSimpleParticle(world, { x:x, y:y, z: cor1.z }, particle, 1)
  }, cor1.x, cor1.y, cor2.x, cor2.y)

  execute2DEdgeArea(function(x, y) {
    spawnSimpleParticle(world, { x:x, y:y, z: cor2.z }, particle, 1)
  }, cor1.x, cor1.y, cor2.x, cor2.y)

  // for y edges
  execute2DEdgeArea(function(x, z) {
    spawnSimpleParticle(world, { x:x, y: cor1.y, z:z }, particle, 1)
  }, cor1.x, cor1.z, cor2.x, cor2.z)

  execute2DEdgeArea(function(x, z) {
    spawnSimpleParticle(world, { x:x, y: cor2.y, z:z }, particle, 1)
  }, cor1.x, cor1.z, cor2.x, cor2.z)

  // and for x edges
  execute2DEdgeArea(function(z, y) {
    spawnSimpleParticle(world, { x: cor1.x, y:y, z:z }, particle, 1)
  }, cor1.z, cor1.y, cor2.z, cor2.y)

  execute2DEdgeArea(function(z, y) {
    spawnSimpleParticle(world, { x: cor2.x, y:y, z:z }, particle, 1)
  }, cor1.z, cor1.y, cor2.z, cor2.y)
}

function spawnSimpleParticle(world, cor, particle, count) {
  world.spawnParticle(particle, cor.x, cor.y, cor.z, 0, 0, 0, 0, count)
}

function execute2DEdgeArea(execute, x1, y1, x2, y2) {
  execute2DAreaWithProperties(execute, x1, y1, x2, y2, { edge_only: true })
}

function execute2DArea(execute, x1, y1, x2, y2) {
  execute2DAreaWithProperties(execute, x1, y1, x2, y2, {})
}

function execute2DAreaWithProperties(execute, x1, y1, x2, y2, props) {
  var left, right
  if (x1 > x2) {
    left = x2
    right = x1
  } else {
    left = x1
    right = x2
  }

  var top, bottom
  if (y1 > y2) {
    top = y1
    bottom = y2
  } else {
    top = y2
    bottom = y1
  }

  for (var x = left; x <= right; x++) {
    for (var y = bottom; y <= top; y++) {
      if (props.edge_only) {
        if ((x == left || x == right) || (y == bottom || y == top))
          execute(x, y);
      } else execute(x, y);
    }
  }
}


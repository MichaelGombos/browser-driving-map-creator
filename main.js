const tileTypes = [
  {  tileName:"road",   value:0},
  {  tileName:"wall", value:1},
  {  tileName:"dirt",  value:2},  
  {  tileName:"spawn", value:3},
  { tileName:"finish-up", value:4},
  { tileName:"finish-down", value:5},
  { tileName:"bumper",  value:6},
  { tileName:"check-point-left-road",  value:7},
  { tileName:"check-point-right-road",  value:8},
  { tileName:"check-point-left-dirt", value:9},
  { tileName:"check-point-right-dirt", value:10},
]
const mapCol = document.querySelector("#cols");
const mapRow = document.querySelector("#rows");
const mapSizeSubmit = document.querySelector("#map-size-submit");

const map = document.querySelector("#map");
const paints = document.querySelector("#paints");
const printButton = document.querySelector("#print");
const result = document.querySelector("#result");
const uploadButton = document.querySelector("#upload");
const mapInput = document.querySelector("#map-input")
const brushSizeSelect = document.querySelector("#brush-size-select")

let mapData = [];

let rows = 20;
let columns = 20;
let currentFill = {
  type : tileTypes.find(t => t.tileName == "wall"),
  size : 1
}
let painting = false;
let spawnTile =    
{
  type:tileTypes[3], 
  row:6,
  column:8,
  element : null
}

let spawnElement;
let newRow;
let newColumn;

let brushSizes = //each brush size is an array of coord objects
{
  finish: [
    {r:0, c:-2}, { r:0, c:-1 },{ r:0,  c:0 }, { r:0 , c:1} , {r:0, c:2}
  ],
  checkPoint: [
    {r:-2, c:0}, { r:-1, c:0 },{ r:0,  c:0 }, { r:1 , c:0} , {r:2, c:0}
  ],
  brush1: [
    {r:0,c:0}
  ],
  brush2: [
    {r:0,c:0},{r:0,c:1},{r:1,c:0},{r:1,c:1}
  ],
  brush3: [
    {r:-1,c:0},{r:0,c:-1},{r:0,c:0},{r:1,c:0},{r:0,c:1}
  ]
}

const setTile = (coords, type) => {

  mapData[coords.r][coords.c] = currentFill.type.value;
  let tile = map.children[coords.r].children[coords.c];
  // //remove all classes from selected tile , then add 
  for(let className of tileTypes.map(x => x.tileName)){
    tile.classList.remove(className);
  }
  tile.classList.add(type.type.tileName); 
}

const bucketFill = (r,c, type, current) => {
  //If row is less than 0
    if(r < 0){
        return;
    }

    //If column is less than 0
    if(c < 0){
        return;
    }

    //If row is greater than map length
    if(r > mapData.length - 1){
        return;
    }

    //If column is greater than map length
    if(c > mapData[r].length - 1){
        return;
    }

    //If the current tile is not the type we need to swap
    if(mapData[r][c] !== current){
        return;
    }
    
     //Update the new tpe
     setTile({r:r,c:c},type)
     //Fill in all four directions
     bucketFill(r-1,c, type, current);
     bucketFill(r+1,c, type, current);
     bucketFill(r,c-1, type, current);
     bucketFill(r,c+1, type, current);
}

const fillTiles = (e,currentFill) => {
  const leftBound = 0; 
  const rightBound = mapData[0].length-1;
  const topBound = 0;
  const bottomBound = mapData.length-1;

  const r = parseInt(e.target.dataset.row);
  const c = parseInt(e.target.dataset.column);



  if(currentFill.type.tileName == "spawn"){
    //if spawn tile is already set,  and change the dom map tile class to road
    spawnTile.element.classList.remove("spawn");
    spawnTile.element.classList.add("road");
    mapData[spawnTile.element.dataset.row][spawnTile.element.dataset.column] = 0; //road

    //set spawn element again
    spawnTile.element = e.target;

  }


  else if (currentFill.type.tileName == "check-point-left-road" ||
   currentFill.type.tileName == "check-point-right-road" ||
   currentFill.type.tileName == "check-point-left-dirt" ||
   currentFill.type.tileName == "check-point-right-dirt"  ){
  
    const checkPointLineBroken = r - 2 < topBound || r + 2 > bottomBound; //total size of 5

    if(checkPointLineBroken){
      //set current tile to road
      mapData[r][c] = 0;
      map.children[r].children[c].classList.remove("finish-up","finish-down");
      map.children[r].children[c].classList.add("road");
    }
    else{
      for(let coord of brushSizes.checkPoint){      
        setTile({r:r+coord.r,c:c+coord.c},currentFill);
      }
    }
   
  }

  else if (currentFill.type.tileName == "finish-up" || currentFill.type.tileName == "finish-down"){
  
    const finishLineBroken = c - 2 < leftBound || c + 2 > rightBound; //total size of 5

    if(finishLineBroken){
      //set current tile to road
      mapData[r][c] = 0;
      map.children[r].children[c].classList.remove("finish-up","finish-down");
      map.children[r].children[c].classList.add("road");

    }
    else{
      for(let coord of brushSizes.finish){      
        setTile({r:r+coord.r,c:c+coord.c},currentFill);
      }
    }
   
  }

  //brush size 2 
  else if(currentFill.size == 2){
   if(c + 1 <= rightBound && r + 1 <= bottomBound){
     for(let coord of brushSizes.brush2){      
      setTile({r:r+coord.r,c:c+coord.c},currentFill);
    }
   }
   else{
   }
  }

  //brush size 3 
  else if(currentFill.size == 3){
    if(c - 1 >= leftBound && c + 1 <= rightBound && r - 1 > topBound && r + 1 < bottomBound) {
      for(let coord of brushSizes.brush3){      
        setTile({r:r+coord.r,c:c+coord.c},currentFill);
      }
   }
    
    else{
    }
  }
  else if(currentFill.size == "fill"){

    bucketFill(r,c,currentFill,mapData[r][c]);
  }

    //set center tile
    setTile({r:r,c:c},currentFill);
}

const handleTileFill = (method) => (e) => {
  if(method == "point"){
    fillTiles(e,currentFill);
  }
  else if(method == "drag"){
    //check if mouse is held down
    if(painting){
      fillTiles(e,currentFill);
    }
  }
}

const handleTileHover = (e) => {
  if(!painting){
    e.target.classList.add("tile-hover")

    let r = parseInt(e.target.dataset.row);
    let c = parseInt(e.target.dataset.column);
  
    const leftBound = 0; 
    const rightBound = mapData[0].length-1;
    const topBound = 0;
    const bottomBound = mapData.length-1;
  
    if(currentFill.type.tileName == "finish-up" || currentFill.type.tileName == "finish-down"){
  
      let finishLineBroken = c - 2 < leftBound || c + 2 > rightBound;
  
      if(!finishLineBroken){
        for(let coord of brushSizes.finish){      
          map.children[r+coord.r].children[c+coord.c].classList.add("tile-hover")
        }
      }
      }
    else if(currentFill.size == 2){
      if(c + 1 <= rightBound && r + 1 <= bottomBound){
        for(let coord of brushSizes.brush2){      
          map.children[r+coord.r].children[c+coord.c].classList.add("tile-hover")
       }
      }
      else{
      }
    }
    else if(currentFill.size == 3){
      if(c - 1 >= leftBound && c + 1 <= rightBound && r - 1 > topBound && r + 1 < bottomBound){
        for(let coord of brushSizes.brush3){      
          map.children[r+coord.r].children[c+coord.c].classList.add("tile-hover")
       }
      }
      else{
      }
    }
  }

}

const handleRemoveHover = (e) => {
  e.target.classList.remove("tile-hover");

  let r = parseInt(e.target.dataset.row);
  let c = parseInt(e.target.dataset.column);

  const leftBound = 0; 
  const rightBound = mapData[0].length-1;
  const topBound = 0;
  const bottomBound = mapData.length-1;

  if(currentFill.type.tileName == "finish-up" || currentFill.type.tileName == "finish-down"){

    let finishLineBroken = c - 2 < leftBound || c + 2 > rightBound;

    if(finishLineBroken){
        
    }
    else{
      for(let coord of brushSizes.finish){      
        map.children[r+coord.r].children[c+coord.c].classList.remove("tile-hover")
      }
    }
    }
  else if(currentFill.size == 2){
    if(c + 1 <= rightBound && r + 1 <= bottomBound){
      for(let coord of brushSizes.brush2){      
        map.children[r+coord.r].children[c+coord.c].classList.remove("tile-hover")
     }
    }

  }
  else if(currentFill.size == 3){
    if(c - 1 >= leftBound && c + 1 <= rightBound && r - 1 > topBound && r + 1 < bottomBound){
      for(let coord of brushSizes.brush3){      
        map.children[r+coord.r].children[c+coord.c].classList.remove("tile-hover")
     }
    }
  }

}

const handleTypeChange = (type) => (e) => {
  currentFill.type = type;
}

const handleBrushSizeChange = (e) => {
  currentFill.size =  e.target.value;
}

const handlePrint = (e) => {
  result.innerHTML = "[" + mapData.map(mapRow => "\n[" + mapRow.map(cell => cell ) + "]") + "\n]";
}

const handleUpload = (e) => {
  generateMap(JSON.parse("[" + mapInput.value + "]")[0])
}

const handleMapSizeChange = (e) => {
  e.preventDefault();

  rows = mapRow.value;
  columns = mapCol.value;

  generateMap(generateDefaultMapData(rows,columns));
}



//TODO -- seperate
//generate domMap and mapdata
const generateDefaultMapData = (rows,columns) => {
  let primativeMapData = [];

  for(let r = 0; r < rows; r++ ){
    let mapRow = new Array();
    for(let c = 0; c < columns; c++){
      if(r == spawnTile.row && c == spawnTile.column){
        mapRow.push(3); //spawn 
      }
      else{
        // mapRow.push(0); // road
        mapRow.push(2); //dirt
      }
    }
    primativeMapData.push(mapRow);
  }
  return primativeMapData;
}
const generateMap = (data) => {
  mapData = data;
  
  //clear map
  while(map.firstChild){
    map.removeChild(map.firstChild);
  }

  for(let r = 0; r < mapData.length; r++){
    let row = document.createElement("div");
    row.classList.add("row");
    for(let c = 0; c < mapData[0].length; c++){
      let tile = document.createElement("div")
      tile.dataset.row = r;
      tile.dataset.column = c;

      //spawn tile 

      //set tile based on value 
      if(mapData[r][c] > 0 && mapData[r][c] < tileTypes.length){
        tile.classList.add("tile");
        tile.classList.add(tileTypes[mapData[r][c]].tileName)
      }

      tile.addEventListener("mouseover",handleTileFill("drag"))
      tile.addEventListener("click",handleTileFill("point"))
      tile.addEventListener("mouseover", handleTileHover)
      tile.addEventListener("mouseout", handleRemoveHover)
      row.appendChild(tile);
    }
    map.appendChild(row);
  }

}

generateMap(generateDefaultMapData(rows,columns));

//display tiles 
for(let type of tileTypes){
  let paint = document.createElement("div")

  let paintHeader = document.createElement("h3");
  let paintTile = document.createElement("div");

  paintHeader.innerText = type.tileName;

  paintTile.classList.add("paint-tile")
  paintTile.classList.add(type.tileName)
  paintTile.dataset.name = type.tileName;
  paintTile.addEventListener("click",handleTypeChange(type));
  
  paint.appendChild(paintTile);
  paint.appendChild(paintHeader);


  paints.appendChild(paint);


  
}

printButton.addEventListener("click",handlePrint)
uploadButton.addEventListener("click",handleUpload);

document.addEventListener("mousedown", () => painting = true)
document.addEventListener("mouseup", () => painting = false);

mapSizeSubmit.addEventListener("click",handleMapSizeChange);
brushSizeSelect.addEventListener("change", handleBrushSizeChange);
const tileTypes = [
  {  tileName:"road",    color:"orange",  colorHex:"#FFA500",  value:0},
  {  tileName:"wall",    color: "red",    colorHex:"#FF0000",  value:1},
  {  tileName:"dirt",    color:"brown",   colorHex:"#964B00",  value:2},  
  {  tileName:"spawn",    color: "cyan",    colorHex:"#71c9ff", value:3},
  { tileName:"finish", color:"green", colorHex:"#73ff71", value:4}
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
let finishLine = 
{
  type:tileTypes[4],  
  row: null,
  columnStart: null,
  columnEnd: null
}
let spawnElement;
let newRow;
let newColumn;

let brushSizes = //each brush size is an array of coord objects
{
  finish: [
    {r:0, c:-2}, { r:0, c:-1 },{ r:0,  c:0 }, { r:0 , c:1} , {r:0, c:2}
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
  // //set selected tile to new type. BASED ON S S S S IIIIZE!!!!

  mapData[coords.r][coords.c] = currentFill.type.value;
  let tile = map.children[coords.r].children[coords.c];

  // //remove all classes from selected tile , then add 
  tile.classList.remove("road","dirt","wall","spawn","finish");
  tile.classList.add(currentFill.type.tileName); 
}

const fillTiles = (e,currentFill) => {
  const leftBound = 0; 
  const rightBound = mapData[0].length-1;
  const topBound = 0;
  const bottomBound = mapData.length-1;

  const r = parseInt(e.target.dataset.row);
  const c = parseInt(e.target.dataset.column);

  //set center tile
  setTile({r:r,c:c},currentFill);

  if(currentFill.type.tileName == "spawn"){
    //if spawn tile is already set,  and change the dom map tile class to road
    spawnTile.element.classList.remove("spawn");
    spawnTile.element.classList.add("road");
    mapData[spawnTile.element.dataset.row][spawnTile.element.dataset.column] = 0; //road

    //set spawn element again
    spawnTile.element = e.target;

  }

  else if (currentFill.type.tileName == "finish"){
    //if finish line is set, remove it from mapData, and change the Old finish line tiles to road.
    if(finishLine.row != null && finishLine.columnStart != null && finishLine.columnEnd != null){
      
      for(let cs = finishLine.columnStart; cs <= finishLine.columnEnd; cs++){
        mapData[finishLine.row][cs] = 0; // road
        map.children[finishLine.row].children[cs].classList.remove("finish");
        map.children[finishLine.row].children[cs].classList.add("road");
      }
    }
    else{
      //no finish line yet. 
    }
  
    const finishLineBroken = c - 2 < leftBound || c + 2 > rightBound; //total size of 5

    if(finishLineBroken){
      //set current tile to road
      mapData[r][c] = 0;
      map.children[r].children[c].classList.remove("finish");
      map.children[r].children[c].classList.add("road");

    }
    else{
      // set finish line 
      finishLine.row = r;
      finishLine.columnStart = c - 2;
      finishLine.columnEnd = c + 2;

      for(let coord of brushSizes.finish){      
        setTile({r:r+coord.r,c:c+coord.c},currentFill);
      }
    }
   
  }

  //brush size 2 
  else if(currentFill.size == 2){
    //check if c + 1 < rightBound, confirm if r + 1 < bottomBound. (square w/ origin in top right)
   if(c + 1 <= rightBound && r + 1 <= bottomBound){
     console.log("within range for fill2 ");
     for(let coord of brushSizes.brush2){      
      setTile({r:r+coord.r,c:c+coord.c},currentFill);
    }
   }
   else{
     console.log("outside of range for fill2", r , c);
   }
  }

  //brush size 3 
  else if(currentFill.size == 3){
    //check if c - 1 > leftBound && c+ 1 < rightBound && r -1 > topBound && r + 1 < bottomBound
    if(c - 1 >= leftBound && c + 1 <= rightBound && r - 1 > topBound && r + 1 < bottomBound) {
      console.log("In of range for fill3", r , c);
      for(let coord of brushSizes.brush3){      
        setTile({r:r+coord.r,c:c+coord.c},currentFill);
      }
     console.log(fillTiles);
   }
    
    else{
      console.log("outside of range for fill3", r , c);
    }
  }
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
  
  e.target.classList.add("tile-hover")
  // console.log("triggered",currentFill);
  if(currentFill.type.tileName == "finish"){

    let checker = 2; //total width of 5
    let r = parseInt(e.target.dataset.row);
    let c = parseInt(e.target.dataset.column);


    let bottomBound = 0; 
    let topBound = mapData[0].length-1;
  
    //check if c - 1 c - 2 c + 1 and c + 2 are all actually inside of the array bounds. 
    let finishLineBroken = c - checker < bottomBound || c + checker > topBound;

    if(finishLineBroken){
        // console.log("UNABLE TO PLACE FINISH LINE");
    }
    else{
      for(let i = 0-checker; i <= checker ; i ++){
        //set hover tiles  
        map.children[r].children[c+i].classList.add("tile-hover")
      }
    }
    }
  else if(currentFill.size == 2){

  }
}

const handleRemoveHover = (e) => {
  e.target.classList.remove("tile-hover");

  if(currentFill.type.tileName == "finish"){
    let checker = 2; //total width of 5
    let r = parseInt(e.target.dataset.row);
    let c = parseInt(e.target.dataset.column);
  
    let bottomBound = 0; 
    let topBound = mapData[0].length-1;

    let finishLineBroken = c - checker < bottomBound || c + checker > topBound;

    if(finishLineBroken){
      // console.log("UNABLE TO PLACE FINISH LINE");
  }
    else{
      for(let i = 0-checker; i <= checker ; i ++){
        //set hover tiles  
        map.children[r].children[c+i].classList.remove("tile-hover")
      }
    }
  }

}

const handleTypeChange = (type) => (e) => {
  currentFill.type = type;
  //set fill type, and change fill tiles 
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
  console.log(e.target);

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
        mapRow.push(0); // road
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

  console.log(mapData);
  for(let r = 0; r < mapData.length; r++){
    let row = document.createElement("div");
    row.classList.add("row");
    for(let c = 0; c < mapData[0].length; c++){
      let tile = document.createElement("div")
      tile.dataset.row = r;
      tile.dataset.column = c;

      //spawn tile 

      //set tile based on value 
      if(mapData[r][c] == 4 ){
        tile.classList.add("tile");
        tile.classList.add("finish")
        //find finish line dimensions
      }
      else if(mapData[r][c] == 3 ){
        tile.classList.add("tile");
        tile.classList.add("spawn")
        spawnTile.element = tile;
      }
      else if(mapData[r][c] == 2 ){
        tile.classList.add("tile");
        tile.classList.add("dirt")
      }
      else if(mapData[r][c] == 1 ){
        tile.classList.add("tile");
        tile.classList.add("wall")
      }
      else if(mapData[r][c] == 0 ){
          tile.classList.add("tile");
          tile.classList.add("road")
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
  
  paint.appendChild(paintHeader);
  paint.appendChild(paintTile);

  paints.appendChild(paint);


  
}

printButton.addEventListener("click",handlePrint)
uploadButton.addEventListener("click",handleUpload);

document.addEventListener("mousedown", () => painting = true)
document.addEventListener("mouseup", () => painting = false);

mapSizeSubmit.addEventListener("click",handleMapSizeChange);
brushSizeSelect.addEventListener("change", handleBrushSizeChange);
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

let rows = 20;
let columns = 20;
let mapData = [];
let currentFill = tileTypes.find(t => t.tileName == "wall"); 
let painting = false;
let spawnTile =    
{
  type:tileTypes[3], //spawn
  row:6,
  column:2
}
let spawnElement;
let newRow;
let newColumn;

const fillTile = (e,currentFill) => {
  //set selected tile to new type.
  mapData[e.target.dataset.row][e.target.dataset.column].type = currentFill;

  //remove all classes from selected tile 
  e.target.classList.remove("road","dirt","wall","spawn","finish");

  if(currentFill == tileTypes.find(t => t.tileName == "spawn")){
    //if spawn tile is already set, remove it from mapData, and change the dom map tile class to road
    spawnElement.classList.remove("spawn");
    spawnElement.classList.add("road");

    //set spawn element again
    spawnElement = e.target;
  }

  else if(currentFill == tileTypes.find(t => t.tileName == "finish")){
    console.log("HERE COMES THE FINISH LINE LOGIC")
  }
  e.target.classList.add(currentFill.tileName); 
}

const handleTileFill = (method) => (e) => {
  if(method == "point"){
    fillTile(e,currentFill);
  }
  else if(method == "drag"){
    //check if mouse is held down
    if(painting){
      fillTile(e,currentFill);
    }
  }
}

const handleTileHover = (currentFill) => (e) => {
  console.log("Current Fill, Hovering TIle", currentFill, e.target);
  e.target.classList.add("tile-hover")
}

const handleRemoveHover = (e) => {
  e.target.classList.remove("tile-hover");
}

const handleTypeChange = (type) => (e) => {
  currentFill = type;
}

const handlePrint = (e) => {
  // console.log(mapData.map(mapRow => mapRow.map(cell => cell.type.value ) ))
  result.innerHTML = "[" + mapData.map(mapRow => "\n[" + mapRow.map(cell => cell.type.value ) + "]") + "\n]";
}

const handleMapSizeChange = (e) => {
  e.preventDefault();
  console.log(e.target);

  rows = mapRow.value;
  columns = mapCol.value;

  generateMap();
}

//generate domMap and mapdata

const generateMap = () => {
  mapData = [];
  
  while(map.firstChild){
    map.removeChild(map.firstChild);
  }


  for(let r = 0; r < rows; r++ ){
    let mapRow = new Array();
    mapData.push(mapRow);
    let row = document.createElement("div");
    row.classList.add("row");
    for(let c = 0; c < columns; c++){
      let tile = document.createElement("div")
      tile.dataset.row = r;
      tile.dataset.column = c;
      //place spawn tile
      if(r == spawnTile.row && c == spawnTile.column){
        mapRow.push(spawnTile);
        tile.classList.add("tile");
        tile.classList.add("spawn")
        spawnElement = tile;
      }
      else{
        mapRow.push(
          {
            type:tileTypes[0], //road
            row:r,
            column:c
          });
          tile.classList.add("tile");
          tile.classList.add("road")
      }
  
  
      tile.addEventListener("mouseover",handleTileFill("drag"))
      tile.addEventListener("click",handleTileFill("point"))
      tile.addEventListener("mouseover", handleTileHover(currentFill))
      tile.addEventListener("mouseout", handleRemoveHover)
      row.appendChild(tile);
    }
    map.appendChild(row);
  }
}

generateMap();

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

document.addEventListener("mousedown", () => painting = true)
document.addEventListener("mouseup", () => painting = false);

mapSizeSubmit.addEventListener("click",handleMapSizeChange);

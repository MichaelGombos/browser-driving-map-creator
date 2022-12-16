const rows = 20;
const columns = 20;
const tileTypes = [
  {  tileName:"road",    color:"orange",  colorHex:"#FFA500",  value:0},
  {  tileName:"dirt",    color:"brown",   colorHex:"#964B00",  value:2},  
  {  tileName:"wall",    color: "red",    colorHex:"#FF0000",  value:1}
]
const map = document.querySelector("#map");
const paints = document.querySelector("#paints");
const printButton = document.querySelector("#print");
const result = document.querySelector("#result");
let mapData = [];
let currentFill = tileTypes[2] // wall
let painting = false;


const handleTileFill = (method) => (e) => {
  if(method == "point"){
    mapData[e.target.dataset.row][e.target.dataset.column].type = currentFill;
    e.target.classList.remove("road","dirt","wall");
    e.target.classList.add(currentFill.tileName); 
  }
  else if(method == "drag"){
    //check if mouse is held down
    if(painting){
      mapData[e.target.dataset.row][e.target.dataset.column].type = currentFill;
      e.target.classList.remove("road","dirt","wall");
      e.target.classList.add(currentFill.tileName); 
    }
  }
}

const handleTypeChange = (type) => (e) => {
  console.log("changed type");
  currentFill = type;
}

const handlePrint = (e) => {
  // console.log(mapData.map(mapRow => mapRow.map(cell => cell.type.value ) ))
  result.innerHTML = "[" + mapData.map(mapRow => "\n[" + mapRow.map(cell => cell.type.value ) + "]") + "\n]";
}


//generate domMap and mapdata
for(let r = 0; r < rows; r++ ){
  let mapRow = new Array();
  console.log(mapRow);
  mapData.push(mapRow);
  let row = document.createElement("div");
  row.classList.add("row");
  for(let c = 0; c < columns; c++){
    let tile = document.createElement("div")
    tile.dataset.row = r;
    tile.dataset.column = c;
    mapRow.push(
      {
        type:tileTypes[0], //road
        row:r,
        column:c
      }
      );
    tile.classList.add("tile");
    tile.classList.add("road")
    tile.addEventListener("mouseover",handleTileFill("drag"))
    tile.addEventListener("click",handleTileFill("point"))
    row.appendChild(tile);
  }
  map.appendChild(row);
}

for(let type of tileTypes){
  let paint = document.createElement("div")

  let paintHeader = document.createElement("h3");
  let paintTile = document.createElement("div");

  paintHeader.innerText = type.tileName;

  paintTile.classList.add("paint-tile")
  paintTile.classList.add(type.tileName)
  console.log(paintTile);
  console.log(paintTile.style);
  paintTile.dataset.name = type.tileName;
  paintTile.addEventListener("click",handleTypeChange(type));
  
  paint.appendChild(paintHeader);
  paint.appendChild(paintTile);

  paints.appendChild(paint);

  console.log(type);
  console.log(type.tileName);
  console.log(type.color);
  console.log(type.colorHex);
  console.log(type.value);

  
}

printButton.addEventListener("click",handlePrint)

document.addEventListener("mousedown", () => painting = true)
document.addEventListener("mouseup", () => painting = false);



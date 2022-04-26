import React from "react";
import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense
import { Box, Button, Select } from "@chakra-ui/react";
import mapsJson from "../data/map/maps.json";
import { TileMap } from "./TileMap";
import { useNavigate, useParams } from "react-router-dom";

let w = 1920;
let h = 1760;
let imgmap: p5Types.Image;
const tileSize = 16;
let canvas: p5Types.Renderer;
let savedTiles: Set<string> = new Set();

let maps: {[mapfilename: string]: TileMap} = {};
mapsJson.map(tilemap => {
  maps[tilemap.name] = tilemap;
});
console.log(maps);
  
export const TileMapViewer = () => {
  let { mapname } = useParams();
  let mapfile = mapname ?? 'Town';
  
  let navigate = useNavigate();

	//See annotations in JS for more information
	const setup = (p5: p5Types, canvasParentRef: Element) => {
    canvas = p5.createCanvas(maps[mapfile].width, maps[mapfile].height).parent(canvasParentRef);
		
    p5.loadImage(`../maps/${maps[mapfile].filename}`, img => {
      imgmap = img;
      p5.image(img, 0, 0);
    })

    // mapsJson.map(tilemap => {
    //   let filename = tilemap.filename;
    //   p5.loadImage(`maps/${filename}`, img => {
    //     console.log(filename);
    //     imgmaps[tilemap.name] = img;
    //   })
    // });

    canvas.mouseMoved(() => {
      let tx = Math.floor(p5.mouseX / tileSize);
      let ty = Math.floor(p5.mouseY / tileSize);
      let px = tx * tileSize;
      let py = ty * tileSize;
      
      // redraw map image
      p5.background(imgmap);

      // highlight box
      let highlightColor = p5.color(255, 204, 0);
      p5.stroke(highlightColor);
      p5.strokeWeight(2);
      p5.fill(p5.color(0, 0));

      savedTiles.forEach((coord) => {
        let saved = coord.split(',');
        let savedTx =  parseInt(saved[0]);
        let savedTy =  parseInt(saved[1]);
        let savedPx = savedTx * tileSize;
        let savedPy = savedTy * tileSize;
        p5.square(savedPx, savedPy, tileSize);
      })

      p5.square(px, py, tileSize);

      // coordinate text box
      p5.stroke(p5.color(0, 255))
      p5.strokeWeight(1);
      p5.fill(p5.color(255, 200));

      savedTiles.forEach((coord) => {
        let saved = coord.split(',');
        let savedTx =  parseInt(saved[0]);
        let savedTy =  parseInt(saved[1]);
        let savedPx = savedTx * tileSize;
        let savedPy = savedTy * tileSize;
        p5.rect(savedPx, savedPy - 20, 75, 15);
      });

      p5.rect(px, py - 20, 75, 15);

      // coordinate text
      p5.fill(p5.color(0, 255));
      p5.noStroke();

      savedTiles.forEach((coord) => {
        let saved = coord.split(',');
        let savedTx =  parseInt(saved[0]);
        let savedTy =  parseInt(saved[1]);
        let savedPx = savedTx * tileSize;
        let savedPy = savedTy * tileSize;
        p5.text(`x: ${savedTx}, y: ${savedTy}`, savedPx + 2, savedPy - 10);
      });

      p5.text(`x: ${tx}, y: ${ty}`, px + 2, py - 10);

    });

    canvas.mousePressed(() => {
      let tileCoord: string = [Math.floor(p5.mouseX / 16), Math.floor(p5.mouseY / 16)].join(',');

      if (savedTiles.has(tileCoord)) {
        savedTiles.delete(tileCoord);
      } else {
        savedTiles.add(tileCoord);
      }
    })
	};

	return (
  <Box>
    <Select value={mapfile} onChange={ e => { 
      navigate(`/mapviewer/${e.target.value}`);
      navigate(0);
      } }>
      {
        mapsJson.map(tilemap => (
          <option value={tilemap.name}>
            {tilemap.name}
          </option>
        ))
      }
    </Select>
    <Sketch setup={setup} />
  </Box>);
  // return <EventStudio />;
};
// Typescript
import p5 from "p5";
import { sketch } from "./src/sketch";

// SCSS
import "./styles/main.scss";

// Starting P5 Sketch
new p5(sketch, document.getElementById("chess"));

import p5 from "p5";
import "./styles.scss";
import { sketch } from "./src/sketch";

// Starting P5 Sketch
new p5(sketch, document.getElementById("chess"));

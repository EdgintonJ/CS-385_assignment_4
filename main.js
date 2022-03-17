
"use strict";

// Jordan Edginton
let gl;
let canvas;
let P; // our Projection transformation
let rotate_angle_sun = 0
let rotate_angle_earth = 0
let rotate_angle_moon = 0
let radius_sun = 0.40
let radius_earth = 0.09
let radius_moon = 0.02
let orbit_earth = 0.8
let orbit_moon = 0.15
let orbit_angle_earth = 0
let orbit_angle_moon = 0


function init() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(10.0); // default
    gl.enable(gl.DEPTH_TEST);


    // Add your sphere creation and configuration code here
    let sun = new Sphere(40, 20)
    let earth = new Sphere(20, 8)
    let moon = new Sphere(10, 5)
    setTimeout(() => {
        requestAnimationFrame(render(sun, earth, moon));
    }, 1000 / 50);
}

function render(sun, earth, moon) {
    // Update your motion variables here

    rotate_angle_sun += 0.01        // time sun
    rotate_angle_earth += 0.04      // time earth
    rotate_angle_moon += 0.1        // time moon
    orbit_angle_earth += 0.03       // date earth
    orbit_angle_moon += 0.6         // date moon

    let ms = new MatrixStack();

    let V_sun = translate(0.0, 0.0, -0.5)
    ms.load(V_sun);
    ms.push();
    ms.scale(radius_sun);
    ms.rotate(rotate_angle_sun, [0, 1, 0])
    sun.color = vec4(1.0, 0.9, 0.0, 1.0)
    sun.P = lookAt(vec3(0, 0, -0.5), vec3(0, 0, 0), vec3(0, 1, 0))
    sun.MV = ms.current()


    let V_earth = translate(orbit_earth * Math.cos(orbit_angle_earth),
        orbit_earth * Math.sin(orbit_angle_earth), -0.5)
    ms.load(V_earth);
    ms.push();
    ms.scale(radius_earth);
    ms.rotate(rotate_angle_earth, [0, 0, 1])
    earth.color = vec4(0.3, 0.4, 1.0, 1.0)
    earth.P = lookAt(vec3(0, 0, -0.5), vec3(0, 1.2, 0), vec3(0, 1, 0))
    earth.MV = ms.current()


    let V_moon = translate(orbit_earth * Math.cos(orbit_angle_earth),
        orbit_earth * Math.sin(orbit_angle_earth) + orbit_moon * Math.cos(orbit_angle_moon),
        orbit_moon * Math.sin(orbit_angle_moon) - 0.5)
    ms.load(V_moon);
    ms.push();
    ms.scale(radius_moon);
    ms.rotate(rotate_angle_moon, [1, 0, 0])
    moon.color = vec4(0.6, 0.6, 0.6, 1.0)
    moon.P = lookAt(vec3(0, 0, -0.5), vec3(0, 1.2, 0), vec3(0, 1, 0))
    moon.MV = ms.current()

    // set up other parameters required to draw Sun


    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    
    // Add your rendering sequence here
    moon.render()
    ms.pop()

    earth.render()
    ms.pop()

    sun.render()
    ms.pop()

    setTimeout(() => {
        requestAnimationFrame(render(sun, earth, moon));
    }, 1000 / 10);

}

window.onload = init;

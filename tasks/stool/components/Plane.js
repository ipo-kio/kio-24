import * as THREE from "three";
import {Sky} from "three/examples/jsm/objects/Sky";

class Plane {

    constructor(scene, renderer) {
        this.scene = scene
        this.renderer = renderer
    }

    initSky = () => {
        // Add Sky
        let sky = new Sky();
        sky.scale.setScalar(450000);
        // Add Sun
        let sun = new THREE.Vector3();

        const effectController = {
            turbidity: 10,
            rayleigh: 3,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.7,
            elevation: 2,
            azimuth: 45,
            exposure: this.renderer.toneMappingExposure
        };

        const uniforms = sky.material.uniforms;
        uniforms['turbidity'].value = effectController.turbidity;
        uniforms['rayleigh'].value = effectController.rayleigh;
        uniforms['mieCoefficient'].value = effectController.mieCoefficient;
        uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
        const theta = THREE.MathUtils.degToRad(effectController.azimuth);
        sun.setFromSphericalCoords(1, phi, theta);
        uniforms['sunPosition'].value.copy(sun);
        this.renderer.toneMappingExposure = effectController.exposure;
        this.scene.add(sky);
    }

    initPlane = (width, height) => {
        // Plane
        let geometry = new THREE.PlaneBufferGeometry(width, height, 50, 50)
        geometry.rotateX(-Math.PI / 2);
        let gridPlane = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({color: "#1C1C1C"}))

        let vertices = geometry.attributes.position.array;

        for (let j = 1; j < vertices.length; j += 3) {
            vertices[j] = Math.pow(Math.sin(0.31 * (vertices[j - 1] + 1) - 0.32 * (vertices[j + 1] + 1)), 2) +
                Math.pow(Math.cos(0.385 * (vertices[j - 1] + 1) + 0.158 * (vertices[j + 1] + 1)), 2);
        }

        let count = geometry.attributes.position.count;
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count*3), 3));

        let color = new THREE.Color();
        for(let i=0; i<count; i++){
            let position = vertices[i*3 + 1];
            color.setRGB(0.72, 0.65 + position/6, 0.88)
            geometry.attributes.color.setXYZ(i, color.r, color.g, color.b);
        }

        // Materials
        const material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            color: "#827888",
            side: THREE.DoubleSide
        })

        this.planeMesh = new THREE.Mesh(geometry, material)
        this.planeMesh.castShadow = true;
        this.planeMesh.receiveShadow = true;
        this.scene.add(this.planeMesh)
        this.scene.add(gridPlane)
    }

}

export default Plane

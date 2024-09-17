varying float vInfluence;

void main() {
   float influence = 1.0 - vInfluence;
   
   float distanceToCentre = distance(gl_PointCoord, vec2(0.5));
   if(distanceToCentre > 0.5) discard;
   
   gl_FragColor = vec4(influence, influence, 1.0, 1.0);
}
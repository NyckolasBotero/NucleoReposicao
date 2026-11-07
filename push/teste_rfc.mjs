import { criptografar } from "./worker_push.js";
const dec=s=>{s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";return new Uint8Array(Buffer.from(s,"base64"))};
const enc=u=>Buffer.from(u).toString("base64url");
const r = await criptografar("When I grow up, I want to be a watermelon",
  dec("BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4"), dec("BTBZMqHH6r4Tts7J_aSIgg"),
  { priv:dec("yfWPiYE-n46HLnH0KqZOF1fJJU3MYrct3AELtAQ-oRw"), pub:dec("BP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8"), salt:dec("DGv6ra1nlYgDCS1FRnbzlw") });
const esperado="DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A_yl95bQpu6cVPTpK4Mqgkf1CXztLVBSt2Ks3oZwbuwXPXLWyouBWLVWGNWQexSgSxsj_Qulcy4a-fN";
console.log(enc(r)===esperado ? "RFC 8291 OK" : "DIFERENTE\n"+enc(r)+"\n"+esperado);

import Alpine from "alpinejs";
import shop from "./alpine/shop.js";
import "./components/video-player.js";
import "./pages/ar.js";

Alpine.data("shop", shop);

window.Alpine = Alpine;
window.Alpine.start();
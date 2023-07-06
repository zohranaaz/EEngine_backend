import { App } from './app';
let app: App;
async function main() {
    
    // Initialize Application
    app = new App();
    app.init();
}
try {
    main();
} catch (error) {
    console.error('Fatal Error Occured in EEngine.',error);
}
// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "./controllers"
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
ModuleRegistry.registerModules([AllCommunityModule]);

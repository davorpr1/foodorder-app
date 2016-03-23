# FoodOrder sample App

This app is based on beatcode project.
BeatCode is used as submodule in order to make developers life easier when using it.

Project is prepared for VisualStudio 2015 SP1.
To start this project, TypeScript of at least version 1.8.6 is required.
Also, ASP.NET 5 support is required.

After cloning this project, submodules should be initialized and updated:
```
git submodules init
git submodules update
```
This will initialize and fetch latest versions of all submodules used by this project (currently just BeatCode).

After submodule preparation, all required packages should be fetched:
```
npm update
```

Make sure that TypeScript with minimum version 1.8.6 is installed. If older version is used, compiling with given ```tsconfig.json``` would produce empty app.js.

Next step is compiling TypeScript code:
```
tsc
```
Running this command manually in root of application will compile just code inside /scripts/foodorder, ignoring /script/beatcode.
If you make change to code inside beatcode, you should run ```tsc``` inside that folder as well.
If you use VisualStudio as IDE, then project rebuild process will trigger TypeScript compiler for beatcode submodule also, so two steps aren't required in that case.

When TypeScript code is compiled into plain ```.js```, everything is ready for application deployment.
During development phase, application deployment is held inside project structure.
Gulp automation is used for app deployment - ``` gulp default ``` is used for copying all neccessary files to wwwroot. ``` gulp clean ``` is used for cleanup of deployed files. ``` gulp webserver ``` is used for hosting application (files from wwwroot).

If VisualStudio2015 is used, then gulp tasks for clean and deployment are mapped to project events.
Basically, build action for project compiles both submodule beatcode and foodapp scripts, deploys all required files to wwwroot and starts debugging with Kestrel or other defined web server (Kestrel, WebListener).

When developing beatcode in parallel with foodapp, after interface change in beatcode project should be rebuild as foodapp references typings defined in scripts/beatcode/beatcode.d.ts.

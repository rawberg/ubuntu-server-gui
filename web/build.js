({
    baseUrl: "./app",
    mainConfigFile: "./app/Boot.js",
    findNestedDependencies: true,
    optimize: "none",
    name: "Boot",
    out: "app/Boot.build.js",
    exclude: ['chai', 'jasmine', 'jasmine_html', 'jasmine_console', 'jasmine_boot']
})
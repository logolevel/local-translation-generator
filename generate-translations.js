const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const templatePath = 'index.html';
const jsonFilesDir = 'translations';
const outputDir = './dist/';

// Read HTML template
const template = fs.readFileSync(templatePath, 'utf-8');

// Get the list of JSON files in directory
const jsonFiles = fs.readdirSync(jsonFilesDir).filter(file => path.extname(file).toLowerCase() === '.json');

// Processing each JSON files
jsonFiles.forEach(jsonFile => {
    const locale = path.basename(jsonFile, path.extname(jsonFile));
    const jsonFilePath = path.join(jsonFilesDir, jsonFile);
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
    let outputDirPath;

    // Do not create new directory for the default root index.html
    if(locale !== 'default') {
        // Create output directory
        outputDirPath = path.join(outputDir, locale);
        fs.mkdirSync(outputDirPath, { recursive: true });
    }

    // Create new HTML page on the template
    const $ = cheerio.load(template, { decodeEntities: false });

    // Change text according to the JSON data
    Object.keys(jsonData).forEach(key => {
        const selector = `[data-${key}]`;
        const element = $(selector);

        if (jsonData[key]) {
            if (element.length > 0) {
                element.text(jsonData[key]);
            } else {
                console.warn(`Warning: Element with selector '${selector}' not found.`);
            }
        } else {
            console.warn(`${locale} locale:`);
            console.warn(`Warning: Translation '${key}' not found. We just left default one`);
            console.warn('');
        }
    });

    // Do not change paths to resources for the default root index.html
    if(locale !== 'default') {
        // Change paths to resources 
        const pathElements = $('[data-path]');

        pathElements.each((index, element) => {
            if($(element).attr('href')) {
                const hrefValue = $(element).attr('href');
                $(element).attr('href', `../${hrefValue}`);
            }
            if($(element).attr('src')) {
                const srcValue = $(element).attr('src');
                $(element).attr('src', `../${srcValue}`);
            }
        });
    }

    // Add class active for current
    const switcherCurrentElements = $(`[data-switcher=${locale}]`);

    switcherCurrentElements.each((index, element) => {
        $(element).addClass('active');
    });

    // Do not write the default root index.html to the separate directory
    if(locale !== 'default') {
        // White HTML page to the appropriate directory
        const outputFilePath = path.join(outputDirPath, 'index.html');
        fs.writeFileSync(outputFilePath, $.html(), 'utf-8');

        console.log(`Generated: ${outputFilePath}`);
    } else {
        const outputFilePath = path.join(outputDir, 'index.html');
        fs.writeFileSync(outputFilePath, $.html(), 'utf-8');
        console.log(`Generated: ${outputFilePath}`);
    }
});

console.log('Generation complete.');

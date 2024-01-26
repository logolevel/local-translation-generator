const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const templatePath = 'index.html';
const jsonFilesDir = 'translations';
const outputDir = './dist/';

// Чтение HTML шаблона
const template = fs.readFileSync(templatePath, 'utf-8');

// Получение списка JSON файлов в директории
const jsonFiles = fs.readdirSync(jsonFilesDir).filter(file => path.extname(file).toLowerCase() === '.json');

// Обработка каждого JSON файла
jsonFiles.forEach(jsonFile => {
    const jsonFilePath = path.join(jsonFilesDir, jsonFile);
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

    // Создание выходной директории
    const outputDirPath = path.join(outputDir, path.basename(jsonFile, path.extname(jsonFile)));
    fs.mkdirSync(outputDirPath, { recursive: true });

    // Создание новой HTML страницы на основе шаблона
    const $ = cheerio.load(template, { decodeEntities: false });

    // Замена текста в тегах на основе данных из JSON файла
    Object.keys(jsonData).forEach(key => {
        const selector = `[data-${key}]`;
        const element = $(selector);

        if (element.length > 0) {
            element.text(jsonData[key]);
        } else {
            console.warn(`Warning: Element with selector '${selector}' not found.`);
        }
    });

    // Запись новой HTML страницы в выходную директорию
    const outputFilePath = path.join(outputDirPath, 'index.html');
    fs.writeFileSync(outputFilePath, $.html(), 'utf-8');

    console.log(`Generated: ${outputFilePath}`);
});

console.log('Generation complete.');

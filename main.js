const fs = require("fs");
const path = require("path");
const mm = require("music-metadata");
const dataUrl = require("dataurl");
const mimeTypes = require("mime-types");
const {app, BrowserWindow, dialog, ipcMain} = require('electron');

function readSound(location) {
	const pm = new Promise((resolve, reject) => {
		fs.readFile(location, (err, data) => {
			if (err) {reject(err);}

			resolve(dataUrl.convert({data, mimetype: mimeTypes.lookup(location)}));
		});
	});

	return pm;
}

ipcMain.on("readSound", (event, location) => {
	readSound(location)
		.then((url) => {
			event.sender.send("soundLoaded", url);
		});
});

ipcMain.on("readFile", (event, name) => {
	const userData = app.getPath('userData');
	const pth = path.join(userData, name);

	if (fs.existsSync(pth)) {
		event.returnValue = fs.readFileSync(pth, "utf8");
	}else{
		event.returnValue = null;
	}
});

ipcMain.on("writeFile", (event, name, data) => {
	if (typeof data != "string") {
		event.returnValue = false;
		return;
	}

	const userData = app.getPath('userData');
	fs.writeFileSync(path.join(userData, name), data);

	event.returnValue = true;
});

async function parseFile(file, scanDir) {
	let stat = fs.lstatSync(file);

	if (stat.isDirectory()) {
		if (!scanDir)
			return;

		let files = fs.readdirSync(file);
		let output = [];

		for (let child of files) {
			let p = (await parseFile(path.join(file, child)));
			if (p)
				output.push(p[0]);
		}
		
		return output;
	}else{
		let ext = path.extname(file);
		if (ext != ".mp3" && ext != ".ogg" && ext != ".wav")
			return;
			
		let out = {date: stat.ctimeMs, extension: ext, location: file, name: path.basename(file).split('.').slice(0, -1).join('.')};

		if (ext == ".mp3") {
			out.tags = await mm.parseFile(file, {native: true});
		}

		return [out];
	}
}

ipcMain.on("pickMusic", async (event, folder) => {
	let files = dialog.showOpenDialog({
		title: "Add music",
		filters: [
			{name: "Sound (.mp3, .wav, .ogg)", extensions: ["mp3", "wav", "ogg"]}
		],
		properties: ["multiSelections", folder ? "openDirectory" : "openFile"]
	});

	if (!files) {
		event.returnValue = [];
		return null;
	}

	let output = [];

	for (let file of files) {
		let arr = await parseFile(file, true);
		if (arr)
			output = output.concat(arr);
	}

	event.returnValue = output;
});

function createWindow () {
	win = new BrowserWindow({width: 800, height: 600, nodeIntegration: false});
	win.loadFile('index.html');
}

app.on('ready', createWindow);
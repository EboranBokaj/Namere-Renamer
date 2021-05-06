const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
//Hot Reload
require("electron-reload")(__dirname);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	// eslint-disable-line global-require
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 650,
		title: "Renamer",
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, "index.html"));

	// Open the DevTools.
	mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

//* APP LOGIC

const fs = require("fs");
//easier user input module
//const prompt = require("prompt-sync")();

const renamingFunction = (dir, oldChar, newChar) => {
	//*SETUP A DIRECTORY
	let dirPath = dir;
	//console.log(dirPath);

	//*READ ALL FILES IN A DIRECTORY (it returns arr of files)
	let files = fs.readdirSync(dirPath);
	//console.log(files);

	if (oldChar.length > 1) {
		for (let i = 0; i < oldChar.length; i++) {
			nowOldChar = oldChar[i];
			nowNewChar = newChar[i];
			//*Creating a regex CRITERIUM FOR RENAMING
			let regex = new RegExp(nowOldChar, "gm");

			//*MAIN LOOP TROUGH FILES ARR
			for (let item of files) {
				//*Checks if name equals renaming criterium and create newName
				if (regex.test(item)) {
					let newName = item.replace(regex, `${nowNewChar}`);
					//console.log("NEW NAME: " + newName);

					//*SETUP A FILE PATH
					const filePath = dirPath + "/" + item;
					//console.log(filePath);

					//*RENAMING THE FILE:
					//First check if the file exist else throw not found then rename it
					if (fs.existsSync(filePath)) {
						fs.renameSync(filePath, dirPath + "/" + newName);
					} else {
						console.log(`${filePath} not found!`);
					}
				}
			}
		}
	} else {
		//*Creating a regex CRITERIUM FOR RENAMING
		let regex = new RegExp(oldChar, "gm");

		//*MAIN LOOP TROUGH FILES ARR
		for (let item of files) {
			//*Checks if name equals renaming criterium and create newName
			if (regex.test(item)) {
				let newName = item.replace(regex, `${newChar}`);
				//console.log("NEW NAME: " + newName);

				//*SETUP A FILE PATH
				const filePath = dirPath + "/" + item;
				//console.log(filePath);

				//*RENAMING THE FILE:
				//First check if the file exist else throw not found then rename it
				if (fs.existsSync(filePath)) {
					fs.renameSync(filePath, dirPath + "/" + newName);
				} else {
					console.log(`${filePath} not found!`);
				}
			}
		}
	}
};

//* RECIVING DATA FROM RENDER PROCESS
ipcMain.on("rename-data", (e, { directory, oldCharacter, newCharacter }) => {
	//* WORKING WITH INPUT DATA
	renamingFunction(directory, oldCharacter, newCharacter);
	//* SENDING REPLAY TO RENDER PROCESS
	e.reply("reply", "CHECK YOUR FILES");
});

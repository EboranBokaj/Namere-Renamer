const { ipcRenderer } = require("electron");

//* SETTING UP ELEMENTS
const directory = document.getElementById("dir-name");
const oldCharacter = document.getElementById("select-name");
const newCharacter = document.getElementById("select-rename");
const submitBtn = document.getElementById("submit-btn");

const info = document.getElementById("my-info");
const infoModule = document.getElementById("info-module");
const exitModule = document.getElementById("close");

const form = document.getElementById("renaming-form");

//* FORM HANDELING
form.addEventListener("submit", (event) => {
	// submit event detected
	event.preventDefault();
	//sumit Button loading display
	submitBtn.classList.add("is-loading");
	let data = {
		directory: directory.value,
		oldCharacter: oldCharacter.value,
		newCharacter: newCharacter.value,
	};
	//* SENDING DATA TO MAIN PROCESS
	ipcRenderer.send("rename-data", data);
	//* RECIVING A REPLAY FROM MAIN PROCESS
	ipcRenderer.on("reply", (e, data) => {
		console.log(data);
	});
	//sumit Button loading exit display
	submitBtn.classList.remove("is-loading");
});

//*Handeling modal info
info.addEventListener("click", () => {
	infoModule.classList.add("is-active");
});
exitModule.addEventListener("click", () => {
	infoModule.classList.remove("is-active");
});

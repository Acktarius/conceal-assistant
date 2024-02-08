//node variables
var nodeH = document.getElementsByName('nodeH')[0].content;

var nodeContainer = document.getElementById("nodeMessage");
var blockchainHeightContainer = document.getElementById("blockchain_height");

//Miner variables
var localIp = document.getElementsByName('localIp')[0].content;
var minerContainer = document.getElementById("minerMessage");
var minerHashContainer = document.getElementById("miner_hash");
var minerHashUnitContainer = document.getElementById("miner_hash_unit");

function renderHTML(container, innerT, color) {
	container.style.color=color;
	container.innerText=innerT;
	setTimeout(() => {
		container.style.color='#b0b3b4';
	}, 60000)
}

//Node
const sendHttpRequest = (method, url, pick) => {
	const promise = new Promise((resolve, reject) => {
		const netx = new XMLHttpRequest();
		netx.open(method, url)
		netx.responseType = 'json';
		netx.onload = () => {
			if (netx.status >=200 && netx.status < 400) {
			resolve(netx.response[pick]);
			} else {
				reject("error getting info");
			}
		};
		netx.onerror = () => {
			reject("error loading info");
		}
		netx.send();
	});
	return promise;
}


nodeContainer.addEventListener("click", (event) => {
	sendHttpRequest ('GET', 'https://explorer.conceal.network/daemon/getinfo', 'height')
		.then((netH) => {
				if (nodeH < netH) {
					renderHTML(blockchainHeightContainer,`${nodeH} /${netH}`, "#cf332a");
				} else {
					renderHTML(blockchainHeightContainer,`${nodeH} /${netH}`, "#007bff");
				}					
		})
		.catch((err) => {
			renderHTML(blockchainHeightContainer, err, "#cf332a");
		});
	});

//Miner
	minerContainer.addEventListener("click", () => {
		sendHttpRequest('GET', `http://${localIp}:3500/hash`, 'hash') 
			.then((minerH) => {
				renderHTML(minerHashContainer, minerH, "#007bff");

			})
			.catch((err) => {
				renderHTML(minerHashContainer, err, "#cf332a");
			});
		});
		minerContainer.addEventListener("click", () => {
			sendHttpRequest('GET', `http://${localIp}:3500/hash`, 'unit') 
				.then((minerH) => {
					renderHTML(minerHashUnitContainer, minerH, "#007bff");
	
				})
				.catch((err) => {
					renderHTML(minerHashUnitContainer, err, "#cf332a");
				});
			});		
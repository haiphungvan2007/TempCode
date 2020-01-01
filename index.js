const https = require('http');
const WebSocket = require('ws');

const server = new https.createServer();
const wss = new WebSocket.Server({ server });

const uuidv4 = require('uuid/v4')


var g_socketHash = {}
var g_userHash = {}


var g_roomHash = {}

function handleLogin(clientSocket, messageData) {
	var userName = "";
	if (messageData.hasOwnProperty("userName")) {
		userName = messageData["userName"];

		var responseData = {
			"messageType": "login_response",
			"message" : {
				"isSuccess" : true,
				"data" : "existed, invalid, failed, success" 
			}
		}

		//Check valid userName
		if (userName == "") {
			responseData.message.isSuccess = false;
			responseData.message.data = "invalid";
			clientSocket.send(JSON.stringify(responseData));
			return;
		}

		if (!g_userHash.hasOwnProperty[userName]) {
			responseData.message.isSuccess = true;
			responseData.message.data = "success";
			clientSocket.send(JSON.stringify(responseData));
			g_userHash[userName] = {
				"socket" : clientSocket,
				"socketID": clientSocket.socketID,
				"userName": userName
			}
			g_socketHash[clientSocket.socketID]["userName"] = userName;
			clientSocket.userName = userName;
			return;
		} else {
			responseData.message.isSuccess = false;
			responseData.message.data = "existed";
			clientSocket.send(JSON.stringify(responseData));
			return;
		}
	}
}


function handleCreateRoom(clientSocket, messageData) {
	var roomName = "";
	if (messageData.hasOwnProperty("roomName")) {
		roomName = messageData["roomName"];
	}
	
	var roomSize = 0;
	if (messageData.hasOwnProperty("roomSize")) {
		roomSize = messageData["roomSize"];
	}
	
	var responseData = {
		"messageType": "create_room_response",
		"message" : {
			"isSuccess" : true,
			"data" : "existed, invalid, failed, success" 
		}
	}

	//Check valid userName
	if ((roomName == "") || (roomSize < 2)) {
		responseData.message.isSuccess = false;
		responseData.message.data = "invalid";
		clientSocket.send(JSON.stringify(responseData));
		return;
	}

	if (!g_roomHash.hasOwnProperty[roomName]) {
		responseData.message.isSuccess = true;
		responseData.message.data = "success";
		clientSocket.send(JSON.stringify(responseData));
		clientSocket.roomName = roomName;
		g_roomHash[roomName] = {
			"roomName" : roomName,
			"roomSize" : roomSize,
			"clientList": [clientSocket]
			"host" : clientSocket
		}
		return;
	} else {
		responseData.message.isSuccess = false;
		responseData.message.data = "existed";
		clientSocket.send(JSON.stringify(responseData));
		return;
	}
	
}

function handleJoinRoom(clientSocket, messageData) {
	var roomName = "";
	if (messageData.hasOwnProperty("roomName")) {
		roomName = messageData["roomName"];

		var responseData = {
			"messageType": "join_room_response",
			"message" : {
				"isSuccess" : true,
				"data" : "not_existed, full, success" 
			}
		}

		if (!g_roomHash.hasOwnProperty[roomName]) {
			if (g_roomHash[roomName].roomSize > g_roomHash[roomName].clientList.length) {
				responseData.message.isSuccess = true;
				responseData.message.data = "success";
				clientSocket.roomName = roomName;
				g_roomHash[roomName].clientList.push(clientSocket);
				
				clientSocket.send(JSON.stringify(responseData));
			} else {
				responseData.message.isSuccess = false;
				responseData.message.data = "full";
				clientSocket.send(JSON.stringify(responseData));
			}
			return;
		} else {
			responseData.message.isSuccess = false;
			responseData.message.data = "not_existed";
			clientSocket.send(JSON.stringify(responseData));
			return;
		}
	}
}

function handleLeaveRoom(clientSocket, messageData) {
	var roomName = "";
	if (messageData.hasOwnProperty("roomName")) {
		roomName = messageData["roomName"];

		var responseData = {
			"messageType": "leave_room_response",
			"message" : {
				"isSuccess" : true,
				"data" : "not_existed, success" 
			}
		}

		if (!g_roomHash.hasOwnProperty[roomName]) {
			//Check user in this room
			var roomObject = g_roomHash[roomName];
			var clientList = roomObject.clientList;
			for (var i = 0; i < clientList.length; i++) {
				var socketObject = clientList[i];
				if (socketObject.userName == clientSocket.userName) {
					responseData.message.isSuccess = true;
					responseData.message.data = "success";
					//If it's host => send reject to all users
					if (roomObject.host.userName == clientSocket.userName) {
						for (var j = 0; j < clientList.length; j++) {
							clientList[j].send(JSON.stringify(responseData));
						}
					} else {
						g_roomHash[roomName].clientList.slice(i);
						clientSocket.send(JSON.stringify(responseData));
					}
					return;
				}
			}
			
			responseData.message.isSuccess = false;
			responseData.message.data = "not_existed";
			clientSocket.send(JSON.stringify(responseData));
			return;
		} else {
			responseData.message.isSuccess = false;
			responseData.message.data = "not_existed";
			clientSocket.send(JSON.stringify(responseData));
			return;
		}
	}
}

function handleStartGame(clientSocket, messageData) {
	var roomName = "";
	if (messageData.hasOwnProperty("roomName")) {
		roomName = messageData["roomName"];

		var responseData =  {
			"messageType": "start_game_response",
			"message" : {
				"isSuccess" : true,
				"data" : "not_existed, failed, success" 
			}
		};

		if (!g_roomHash.hasOwnProperty[roomName]) {
			//Check user in this room
			var roomObject = g_roomHash[roomName];
			var clientList = roomObject.clientList;
			for (var i = 0; i < clientList.length; i++) {
				var socketObject = clientList[i];
				if ((socketObject.userName == clientSocket.userName) 
					&& (roomObject.host.userName == clientSocket.userName)){
					g_roomHash[roomName].clientList.slice(i);
					responseData.message.isSuccess = true;
					responseData.message.data = "success";
					clientSocket.send(JSON.stringify(responseData));
					return;
				}
			}
			
			responseData.message.isSuccess = false;
			responseData.message.data = "failed";
			clientSocket.send(JSON.stringify(responseData));
			return;
		} else {
			responseData.message.isSuccess = false;
			responseData.message.data = "not_existed";
			clientSocket.send(JSON.stringify(responseData));
			return;
		}
	}
}

wss.on('connection', function connection(clientSocket) {
	clientSocket.on('message', function incoming(message) {
		var jsonMessage = JSON.parse(message);
		if (jsonMessage == undefined) {
			return;
		}
		var messageType = "";
		if (jsonMessage.hasOwnProperty("messageType")) {
			messageType = jsonMessage["messageType"];
		}

		var messageData = undefined;
		if (jsonMessage.hasOwnProperty("message")) {
			messageData = jsonMessage["message"];
		}

		if ((messageType == "") || (messageData == undefined)) {
			return;
		}

		if (messageType == "login") {
			handleLogin(clientSocket, messageData);
		} else if (messageType == "createRoom") {
			handleCreateRoom(clientSocket, messageData);
		} else if (messageType == "join_room") {
			handleJoinRoom(clientSocket, messageData);
		} else if (messageType == "leave_room") {
			handleLeaveRoom(clientSocket, messageData);
		} else if (messageType == "start_game") {
			handleStartGame(clientSocket, messageData);
		}
	});

	clientSocket.socketID = uuidv4();
	clientSocket.userName = "";
	clientSocket.roomName = "";
	g_socketHash[clientSocket.socketID] = {
		"socketID": clientSocket.socketID,
		"socket" : clientSocket,
		"userName": ""
	};

	clientSocket.send(JSON.stringify({
		"messageType": "connect_response",
		"message" : {
			"socketID" : clientSocket.socketID
		}
	}));
});




server.listen(3000);



/*

MESSAGE_CONNECT_RESPONSE {
	"messageType": "connect_response",
	"message" : {
		"socketID" : ""
	}
}

MESSAGE_LOGIN {
	"messageType": "login",
	"message" : {
		"userName" : ""
	}
}

MESSAGE_LOGIN_RESPONSE {
	"messageType": "login_response",
	"message" : {
		"isSuccess" : true,
		"data" : "existed, invalid, failed, success" 
	}
}

MESSAGE_CREATE_ROOM {
	"messageType": "create_room",
	"message" : {
		"roomName" : ""
	}
}

MESSAGE_CREATE_ROOM_RESPONSE {
	"messageType": "create_room_response",
	"message" : {
		"isSuccess" : true,
		"data" : "existed, invalid, failed, success" 
	}
}

MESSAGE_JOIN_ROOM {
	"messageType": "join_room",
	"message" : {
		"roomName" : "",
		"roomSize" : 2
	}
}

MESSAGE_JOIN_ROOM_RESPONSE {
	"messageType": "join_room_response",
	"message" : {
		"isSuccess" : true,
		"data" : "not_existed, success" 
	}
}

MESSAGE_LEAVE_ROOM {
	"messageType": "leave_room",
	"message" : {
		"roomName" : ""
	}
}

MESSAGE_LEAVE_ROOM_RESPONSE {
	"messageType": "leave_room_response",
	"message" : {
		"isSuccess" : true,
		"data" : "not_existed, success" 
	}
}

MESSAGE_START_GAME {
	"messageType": "start_game",
	"message" : {
		"roomName" : ""
	}
}

MESSAGE_START_GAME_RESPONSE {
	"messageType": "start_game_response",
	"message" : {
		"isSuccess" : true,
		"data" : "lack, success" 
	}
}

GAME_MESSAGE {
	"messageType": "game_message",
	"message" : {
		"data" : ""
	}
}

{
	"L1" : ["Big 4", "Slow down", "Slider", "Alignment"],
	"L2" : ["Turn X", "Blinder", "Turn Y", "Center"],
	"L2" : ["Stealer", "Collector", "Side effect", "Collapsed"],
	"L4" : ["Stone", "Remote", "Nuclear", "Gravity"]
}



*/
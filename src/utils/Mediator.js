export default class Mediator{
	constructor(channels){
		this.channels = {};
	}

	subscribe(eventName, callback){
		 if(!Array.isArray(this.channels[eventName])){
			this.channels[eventName] = [];
		 }
		 if(typeof callback === "function") {
             this.channels[eventName].push(callback);
         }
		 return this;
	}

	unsubscribe(eventName, callback){
		if(!Array.isArray(this.channels[eventName])){
			return this;
		}

		if(typeof callback === "undefined"){
			this.channels[eventName] = [];
			return this;
		}

		this.channels[eventName] = this.channels[eventName].filter((listener) => listener !== callback);
		return this;
	}

	publish(eventName, data){
		 if(!Array.isArray(this.channels[eventName])){
		 	return this;
		 }

		 this.channels[eventName].forEach((listener) => {
		 	listener(eventName, data);
		 });

		return this;
	}
}
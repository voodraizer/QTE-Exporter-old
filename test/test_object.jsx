#target photoshop

const job = {
    position: 'cashier',
    type: 'hourly',
    isAvailable: true,
};

//~ const job = {
//~     position: 'cashier',
//~     type: 'hourly',
//~     isAvailable: true,
//~     showDetails() {
//~         const accepting = this.isAvailable ? 'is accepting applications' : "is not currently accepting applications";

//~         console.log(`The ${this.position} position is ${this.type} and ${accepting}.`);
//~     }
//~ };

//const barista = Object.create(job);
const barista = new Object(job);


var is_inst = barista instanceof job;
$.writeln("type: " + typeof(barista) + " is instance: " + is_inst);
//$.writeln("prototype: " + Object.getPrototypeOf(barista));
const {
 MynameContract,
} = require("generated");
const crypto = require('crypto');
 
function stringToHash(string) {
  const hash = crypto.createHash('sha256');
  hash.update(string);
  return hash.digest('hex');
}
function tai64ToDate(tai64) {
  const dateStr = (
    (tai64 - BigInt(Math.pow(2, 62)) - BigInt(10)) *
    1000n
  ).toString();
  return new Date(+dateStr).toISOString();
}

function addYears(dateStr, yearsToAdd) {
    const date = new Date(dateStr);
    date.setFullYear(date.getFullYear() + yearsToAdd);
    return date.toISOString();
 }

MynameContract.NameExtendEvent.loader(({event, context}) => {
    context.Myname_NameRegisteredEvent.load(stringToHash(event.data.name));
});

MynameContract.NameExtendEvent.handler(({event, context}) => {
  const entity = {
    id: `${event.transactionId}_${event.receiptIndex}`,
    addtime: `${event.data.addtime}`,
    name: `${event.data.name}`,
    identity: `${event.data.identity.payload.bits}`,
  };
  const existingName = context.Myname_NameRegisteredEvent.get(stringToHash(event.data.name));

  //console.log(existingName.expiry);
  //console.log(Number(event.data.addtime));

  const changeentity = {
    id: `${existingName.id}`,
    starttime: `${existingName.starttime}`,
    expiry: `${addYears(existingName.expiry, Number(event.data.addtime))}`,
    name: `${event.data.name}`,
    identity: `${event.data.identity.payload.bits}`,
  };

  context.Myname_NameExtendEvent.set(entity);
  context.Myname_NameRegisteredEvent.set(changeentity);
});

MynameContract.ResolvingEvent.loader(({event, context}) => {
});

MynameContract.ResolvingEvent.handler(({event, context}) => {
  
  const entity = {
    id: `${event.data.identity.payload.bits}`,
    name: `${event.data.name}`,
    identity: `${event.data.identity.payload.bits}`,
  };

  context.Myname_ResolvingEvent.set(entity);
});

MynameContract.NameTransferEvent.loader(({event, context}) => {
    context.Myname_NameRegisteredEvent.load(stringToHash(event.data.name));
});

MynameContract.NameTransferEvent.handler(({event, context}) => {
  const entity = {
    id: `${event.transactionId}_${event.receiptIndex}`,
    name: `${event.data.name}`,
    from: `${event.data.from.payload.bits}`,
    to: `${event.data.to.payload.bits}`,
  };
  
  const existingName = context.Myname_NameRegisteredEvent.get(stringToHash(event.data.name));
 
  const changeentity = {
    id: `${existingName.id}`,
    starttime: `${existingName.starttime}`,
    expiry: `${existingName.expiry}`,
    name: `${existingName.name}`,
    identity: `${event.data.to.payload.bits}`,
  };

  context.Myname_NameTransferEvent.set(entity);
  context.Myname_NameRegisteredEvent.set(changeentity);
});

MynameContract.BuyEvent.loader(({event, context}) => {
    context.Myname_NameRegisteredEvent.load(stringToHash(event.data.name));
});

MynameContract.BuyEvent.handler(({event, context}) => {
  const entity = {
    id: `${event.transactionId}_${event.receiptIndex}`,
    time: `${tai64ToDate(event.data.time)}`,
    price: `${event.data.price}`,
    name: `${event.data.name}`,
    buyer: `${event.data.buyer.payload.bits}`,
    seller: `${event.data.seller.payload.bits}`,
  };
  
  const existingName = context.Myname_NameRegisteredEvent.get(stringToHash(event.data.name));
  
  const changeentity = {
    id: `${existingName.id}`,
    starttime: `${existingName.starttime}`,
    expiry: `${existingName.expiry}`,
    name: `${existingName.name}`,
    identity: `${event.data.buyer.payload.bits}`,
  };

  context.Myname_BuyEvent.set(entity);
  context.Myname_NameRegisteredEvent.set(changeentity);
  context.Myname_ListEvent.deleteUnsafe(existingName.id);
});

MynameContract.DelistEvent.loader(({event, context}) => {
    context.Myname_NameRegisteredEvent.load(stringToHash(event.data.name));
});

MynameContract.DelistEvent.handler(({event, context}) => {
  const entity = {
    id: `${event.transactionId}_${event.receiptIndex}`,
    name: `${event.data.name}`,
    identity: `${event.data.identity.payload.bits}`,
  };
  
  const existingName = context.Myname_NameRegisteredEvent.get(stringToHash(event.data.name));
  const changeentity = {
    id: `${existingName.id}`,
    starttime: `${existingName.starttime}`,
    expiry: `${existingName.expiry}`,
    name: `${existingName.name}`,
    identity: `${event.data.identity.payload.bits}`,
  };

  context.Myname_DelistEvent.set(entity);
  context.Myname_NameRegisteredEvent.set(changeentity);
  context.Myname_ListEvent.deleteUnsafe(existingName.id);
});

MynameContract.ListEvent.loader(({event, context}) => {
    context.Myname_NameRegisteredEvent.load(stringToHash(event.data.name));
});

MynameContract.ListEvent.handler(({event, context}) => {
  const entity = {
    id: `${stringToHash(event.data.name)}`,
    name: `${event.data.name}`,
    owner: `${event.data.owner.payload.bits}`,
    price: `${event.data.price}`,
  };

  const existingName = context.Myname_NameRegisteredEvent.get(stringToHash(event.data.name));
  const changeentity = {
    id: `${existingName.id}`,
    starttime: `${existingName.starttime}`,
    expiry: `${existingName.expiry}`,
    name: `${existingName.name}`,
    identity: `0`,
  };
  
  context.Myname_ListEvent.set(entity);
  context.Myname_NameRegisteredEvent.set(changeentity);
});

MynameContract.NameRegisteredEvent.loader(({event, context}) => {
});

MynameContract.NameRegisteredEvent.handler(({event, context}) => {
  const entity = {
    id: `${stringToHash(event.data.name)}`,
    starttime: `${tai64ToDate(event.data.starttime)}`,
    expiry: `${tai64ToDate(event.data.expiry)}`,
    name: `${event.data.name}`,
    identity: `${event.data.identity.payload.bits}`,
  };

  context.Myname_NameRegisteredEvent.set(entity);
});

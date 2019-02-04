const LOOKUP = {};
const DATA = {};
for (var i = 0; i < entries.length; i++) {
  var aliases = entries[i]["ALIASES"];
  var type = entries[i]["TYPE"];
  var relations = entries[i]["RELATIONS"];
  var id = i;
  var entry = new Entry(entries[i], id);
  for (var j = 0; j < aliases.length; j++) {
    if (LOOKUP[aliases[j]]) {
      var newEntry = aliases[j]+'_'+type;
      LOOKUP[newEntry] = entry.id;

      if (LOOKUP[aliases[j]].isDisambiguation()) {
        LOOKUP[aliases[j]].add(newEntry);
      }
      else {
        var existingEntry = aliases[j]+'__'+LOOKUP[aliases[j]].type;
        var pages={existingEntry, newEntry}; //make actual object
        LOOKUP[existingEntry] = LOOKUP[aliases[j]];

        LOOKUP[aliases[j]]=pages;
      }
    }
    else {
      LOOKUP[aliases[j]]=entry.id;
    }
    DATA[entry.id]=entry;
  }
}

for (var i = 0; i < DATA.keys.length; i++) {
  namedRelations = DATA[DATA.keys[i]].namedRelations;
  idRelations = {};
  for (var j = 0; j < namedRelations.keys.length; j++) {
    var id = LOOKUP[namedRelations.keys[j]];
    idRelations[id] = namedRelations[namedRelations.keys[j]];
  }
}

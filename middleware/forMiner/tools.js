//this reverse a String
function reverser(esreveRrts) {
    var j = esreveRrts.length 
let strReverse = "";
        while ( j != -1 ) {
        strReverse  += esreveRrts.charAt(j);
        j = j - 1;
        }
    return strReverse
    }

//find a string looking forward from data startingString until endSign    
function afterUntil(data, debutString, endSign) {
    let debutForward = data.search(debutString);
    debutForward = debutForward + debutString.length;
    let forWardString = "";
       var i = 0;
    while (data.slice(debutForward + i, debutForward + i + 1) != endSign) {
        forWardString += data.slice(debutForward + i, debutForward + i +1);
        i++;
    };
    return forWardString;
}

//find a string in reverse form from data ending with endString and starting with endSign    
function backWard(data, endString, endSign) {
    let reverseEnd = data.search(endString);
    let draWkcab = reverser(endString);
    var i = 0;
    while (data.slice(reverseEnd - 1 - i, reverseEnd - i) != endSign) {
        draWkcab += data.slice(reverseEnd - 1 - i, reverseEnd - i);
        i++;
    };
    return draWkcab;
}

function inBetween(data, debut, fin) {
    var d = debut.length;        
    d = d + data.search(debut);
    var f = data.search(fin);
    return data.slice(d,f);
}


function inBetweenLong(data, debut, l) {
    var d = debut.length;        
    d = d + data.search(debut);
    var f = d + l;
    return data.slice(d,f);
}

function startWithLong(data, startWith, l) {
    var d = startWith.length;        
    d = d + data.search(startWith);
    var f = d + l;
    
    return (startWith + data.slice(d,f));
}

module.exports = { reverser , afterUntil, backWard, inBetween, inBetweenLong, startWithLong };

import fiToSciBirdNames from '@/json/birdNamesFItoSCI.json';
import birdSpeciesInfo from '@/json/birdDescriptions.json';
import birdImageInfo from '@/json/birdImgAuthors.json';
import birdInfo from '@/json/birdCharacteristics.json';

var parsedFItoSCI = fiToSciBirdNames;
var parsedSpecies = jsonToArray(birdSpeciesInfo);
var parsedImgInfo = jsonToArray(birdImageInfo);
var parsedbirdInfo = jsonToArray(birdInfo);

export function getBirdFromSpeech(speechResult) {
  if(speechResult) {
    var playAudio = false;
    var bestResults = [];
    // Count words in speech result and
    // if there's more than one, try to find if one
    // of them is bird species name

    var resultArr = speechResult.split(" ");
    var resultLength = resultArr.length;

    if(resultLength > 1) {
      for(var i = 0; i < resultLength; i++) {
        if(parsedFItoSCI.hasOwnProperty(resultArr[i])) {
        //if(parsedFI.FIbirds.includes(resultArr[i])) {
          speechResult = resultArr[i];
          break;
        }
      }

      if (resultArr.includes("kuuntele")) {
        playAudio = true;
      }
    }

    // check if speechResult can be found in finnish bird names
    if(parsedFItoSCI.hasOwnProperty(speechResult)) {
      var sciName = parsedFItoSCI[speechResult];
      var fiName = speechResult;
      return returnInfo(fiName, sciName, bestResults, playAudio);
    } 
    else {
      return getBirdByCharacteristics(resultArr);
    }
  }
  else {
    return false;
  }
}

export function getBirdByCharacteristics(resultArr) {
  var matches = new Map();
  var playAudio = false;

  if(resultArr) {
    if (resultArr.includes("kuuntele")) {
      playAudio = true;
    }
    var resultLength = resultArr.length;

    for(var j = 0; j < parsedbirdInfo.length; j++) {
      var matching = 0;

      for(var i = 0; i < resultLength; i++) {
        var keys = Object.keys(parsedbirdInfo[j][1]);
        keys.forEach(function(key) {
          if(parsedbirdInfo[j][1][key].includes(resultArr[i])) {
            matching++;
          }
        })
      }
      matches.set(parsedbirdInfo[j][0], matching);
    }
    //var bestMatch = [...matches.entries()].reduce((a, e ) => e[1] > a[1] ? e : a);
    
    if(matches.size > 0) {
      // Get 5 best result
      // Order the array by value number, greatest to lowest
      var orderMatches = new Map([...matches.entries()].sort((a, b) => b[1] - a[1]));
      for (const [key, value] of orderMatches.entries()) {
        // Delete results that have 0 points
        if(value < 1) {
          orderMatches.delete(key);
        }
      }
      var bestMatches = [];
      var keys = Array.from(orderMatches.keys());
      var arrSize = (keys.length > 5) ? 5 : keys.length;
      for(var i = 0; i < arrSize; i++) {
        // Push matching bird names to new array
        bestMatches.push(keys[i]);
      }
      // Get first element from names, and remove it from other matches array
      var bestMatch = bestMatches.shift();

      if(bestMatch) {
        var matchingBird = bestMatch.toLowerCase();

        // check if result can be found in finnish bird names
        if(parsedFItoSCI.hasOwnProperty(matchingBird)) {
          var sciName = parsedFItoSCI[matchingBird];
          var fiName = matchingBird;

          return returnInfo(fiName, sciName, bestMatches, playAudio);
        } 
        else {
          return false;
        }
      }
    }
  }
  else {
    return false;
  }
}

function returnInfo(fiName, sciName, bestMatches, playAudio) {
  for(var i = 0; i < parsedSpecies.length; i++) {
    if(parsedSpecies[i][0] === sciName) {
      var birdDescText = parsedSpecies[i][1].post_content;
      var birdDescAuthor = parsedSpecies[i][1].post_author; 
    }
  }

  for(var i = 0; i < parsedImgInfo.length; i++) {
    if(parsedImgInfo[i][0] === sciName) {
      var birdImgInfo = {
        "authUrl" : parsedImgInfo[i][1][0].photographerUrl,
        "authName" : parsedImgInfo[i][1][0].PhotographerName,
        "srcUrl" : parsedImgInfo[i][1][0].imageSourceUrl,
        "imgName" : parsedImgInfo[i][1][0].imageName,
        "license" : parsedImgInfo[i][1][0].license,
      }
    }
  }

  return {
    fiName: fiName,
    sciName: sciName,
    descText: birdDescText,
    descAuthor: birdDescAuthor,
    imgInfo: birdImgInfo,
    bestMatches: bestMatches,
    playAudio: playAudio
  }
}

function jsonToArray(json) {
  var arr = [];
  for(var i in json)
      arr.push([i,json[i]]);
  return arr;
}
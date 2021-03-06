// Simple model to calculate probabilities of expressions and meanings

// set of states (here: objects of reference)
// we represent objects as JavaScript objects to demarcate them from utterances
// internally we treat objects as strings nonetheless
var objects = [{accessory: "blue cap", shape: "robot", string: "robot with blue cap"},
               {accessory: "blue cap", shape: "green monster", string: "green monster with blue cap"},
               {accessory: "red cap", shape: "purple monster", string: "purple monster with red cap"}]

// prior over world states
var objectPrior = function() {
  var obj = uniformDraw(objects)
  return obj.string 
}

// set of possible utterances
var utterances = ["blue cap", "red cap", "green monster"]

// meaning function to interpret the utterances
var meaning = function(utterance, obj){
  _.includes(obj, utterance)
}

// literal listener
var literalListener = function(utterance){
  Infer({model: function(){
    var obj = objectPrior();
    condition(meaning(utterance, obj))
    return obj
  }})
}

// pragmatic speaker
var speaker = function(obj){
  Infer({model: function(){
    var utterance = uniformDraw(utterances)
    factor(literalListener(utterance).score(obj))
    return utterance
  }})
}

// pragmatic listener
var pragmaticListener = function(utterance){
  Infer({model: function(){
    var obj = objectPrior()
    observe(speaker(obj),utterance)
    return obj
  }})
}

// interpretation of 'blue cap' for literal listener
// probabilities assigned to individual objects when hearing 'blue cap'
display('Literal listener interpreting blue cap')
viz.table(literalListener("blue cap"))

// choice of expression for pragmatic speaker
// probabilities assigned to individual expressions when referring to 'green monster with blue cap'
display('Pragmatic speaker choosing utterances for green monster with blue cap')
viz.table(speaker("green monster with blue cap"))

// interpretation of 'blue cap' for pragmatic listener
// probabilities assigned to individual objects when hearing 'blue cap'
display('Pragmatic listener interpreting blue cap')
viz.table(pragmaticListener("blue cap"))

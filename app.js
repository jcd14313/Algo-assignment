const button = document.getElementById("begin");

function isNumber(value) {
  var numberPattern = /^[0-9]+$/;
  return numberPattern.test(value);
}

function checkSched(start, end, user) {
  let isConflict = false;
  for (let k = 0; k < user.length; k++) {
    if (
      (start > user[k][0] && start < user[k][1]) ||
      (end > user[k][0] && end < user[k][1])
    ) {
      isConflict = true;
    }
  }
  return isConflict;
}

function getAssignees(scheds = []) {
  let output = [];
  const LORAINE = "C";
  const CHARLES = "J";
  const users = {
    user1: [], // loraine
    user2: [], // charles
  };

  for (let x = 0; x < scheds.length; x++) {
    // Assign first 2 scheds
    if (users.user1.length === 0) {
      users.user1.push(scheds[x]);
      output.push(LORAINE);
      continue;
    } else if (users.user2.length === 0) {
      users.user2.push(scheds[x]);
      output.push(CHARLES);
      continue;
    }

    const [start, end] = scheds[x];
    const arrKeys = Object.keys(users);

    let isImpossible = true;
    for (let f = 0; f < arrKeys.length; f++) {
      const keyName = arrKeys[f];
      // check user sched if no problem with the current sched
      if (!checkSched(start, end, users[keyName])) {
        users[keyName].push(scheds[x]);
        output.push(keyName === "user1" ? LORAINE : CHARLES);
        isImpossible = false;
        break;
      }
    }
    // if the current does'nt fit for any users make it impossible
    if (isImpossible) {
      output = ["IMPOSSIBLE"];
    }
  }
  return output.join("");
}

// convert into starting hour
function convertIntoBaseMinutes(start, end) {
  // 12hrs is 720min
  const newS = (parseInt(start, 10) + 720) / 60;
  const newE = (parseInt(end, 10) + 720) / 60;
  return [newS, newE];
}

// listen to click event
button.addEventListener("click", function (e) {
  e.preventDefault();

  let totalCases = null;
  let caseCount = 0;

  // enter number of cases
  do {
    totalCases = prompt("Enter number of cases");
  } while (!isNumber(totalCases));

  // loop into all cases
  while (parseInt(totalCases) !== parseInt(caseCount)) {
    let activities = null;
    let numberOfInputs = 0;
    let scheds = [];

    // enter # activities
    do {
      activities = prompt(
        `Enter number of activities for case ${caseCount + 1}`
      );
    } while (!isNumber(activities));

    // creating scheds based on start and end input
    while (parseInt(activities) !== numberOfInputs) {
      let startSched;
      let endSched;

      do {
        let str = prompt(
          `Enter start time and end time in minutes separated by space (e.g 10 20) Activity #${
            numberOfInputs + 1
          }`
        );
        str = str.split(" ");
        startSched = str[0];
        endSched = str[1];
      } while (!isNumber(startSched) || !isNumber(endSched));

      scheds.push(
        convertIntoBaseMinutes(parseInt(startSched), parseInt(endSched))
      );

      numberOfInputs++;
    }
    // display the output
    const assignee = getAssignees(scheds);
    const message = `case #${caseCount + 1}: ${assignee}`;
    console.log(message);
    alert(message);
    // case count
    caseCount++;
  }
});

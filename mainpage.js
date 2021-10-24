// JS for ARC Research Page

// Example structure of the database
// const divisions = // JSON.parse("divisionDatabase.json")
// [
// 	{
// 		name:"Engineering and Applied Science", 
// 		link:"http://eas.caltech.edu/",
// 		departments: [
// 			{
// 				name:"Aerospace", 
// 				link: "http://www.galcit.caltech.edu/"
// 			},
// 			{	
// 				name:"Applied Physics and Material Science",
// 				link: "http://aphms.caltech.edu/"
// 			}
// 		]
// 	}
// ]


// TO RUN LOCALLY, navigate to folder and (using nodejs)
// run "npm install -g live-server"
// To actually run the server, type "live-server"


// First we want to load the navigation bar...
var divisions;

// Basic code fore XMLHTTP Request is from W3 School
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // We basically read in the JSON file
        // Note that the filename is at the bottom of the script
        divisions = JSON.parse(xhttp.responseText);
        console.log("JSON Database Loaded.")

        // We use the tag of divisions to update the HTML Page
		const tag = $("#divisions")

		var divis_ind = 0;
		var dept_ind = 0;

		// First we will display the divisions (e.g. EAS)
		for (const divis of divisions) {

			// Reset which department number at start of loop
			dept_ind = 0;
			// We want each Division to be collapsible
			tag.append(
				$('<input>')
					.attr({
						// type: "checkbox"
						type: "image",
						src: "images/caret.svg",
						style: "width:15px;",
						id: divis.name
					})
				)
			// We want each Division labelled with an anchor tage
			// Which is the link to the division website
			tag.append(
				$('<a>')
					.attr({
						href: divis.link, 
						target: "_blank", 
						rel: "noopener noreferrer"
					})
					.text(divis.name)
				)
			tag.append($('<br>'))


			// Each division has departments within it
			for (const dept of divis.departments) {
				tag.append(
				$('<input>')
					.attr({
						type: "checkbox",
						id: `${divis_ind}, ${dept_ind}`,
						onclick: `clicked(${divis_ind}, ${dept_ind})`
					})
				)

				// We also want each department within each division
				// to have an anchor to the department website
				tag.append(
				$('<a>')
					.attr({
						href: dept.link, 
						target: "_blank", 
						rel: "noopener noreferrer"
					})
					.text(dept.name)
				)
				tag.append($('<br>'))

				dept_ind ++;
			}

			tag.append($('<br>'))

			divis_ind ++;
		}


	}
};

xhttp.open("GET", "divisionDatabase.json", true);
xhttp.send();



// Now we can deal with the display cards


// "Fake Class for testing"
// There is almost certainly a cleaner way of wrtiting this (i.e. with a
// helper function that checks the logical statement).
class singleProf {
	constructor(name, email, depts, accepting,
	studentYears, requirements, students, remote, opportunities) {
		if (name != undefined) {this.name = name} 
			else {this.name = "Not Listed"};
		if (email != undefined) {this.email = email} 
			else {this.email = "Not Listed"};
		if (depts != undefined) {this.depts = depts} 
			else {this.depts = "Not Listed"};
		if (accepting != undefined) {this.accepting = accepting} 
			else {this.accepting = "Not Listed"};
		if (studentYears != undefined) {this.studentYears = studentYears} 
			else {this.studentYears = "Not Listed"};
		if (requirements != undefined) {this.requirements = requirements} 
			else {this.requirements = "Not Listed"};
		if (students != undefined) {this.students = students} 
			else {this.students = "Not Listed"};
		if (remote != undefined) {this.remote = remote} 
			else {this.remote = "Not Listed"};
		if (opportunities != undefined) {this.opportunities = opportunities} 
			else {this.opportunities = "Not Listed"};
	}
}


// Critical Functions

function clicked(divInd, depInd){
	

	// Update Central Opportunity table display
	var checkBox = document.getElementById(`${divInd}, ${depInd}`);

	var cardDeptID = divisions[divInd].departments[depInd].name

	// If the checkbox is checked, display the output text
	if (checkBox.checked == true) {
		console.log("CLICKED!");
		// Here is an example of creating a card.
		// Assuming we find the Prof. Ralph Adolphs. We add this prof's card to
		// the display.
		// const ralph = divisions[0].departments[4].faculty[0]
		// const this_prof = divisions[divInd].departments[depInd].faculty[facInd]
		console.log(divisions[divInd].departments[depInd])
		console.log(`There are ${divisions[divInd].departments[depInd].faculty.length} faculty in this department.`)

		for (const this_prof of divisions[divInd].departments[depInd].faculty) {
			console.log(this_prof);
			makeCard("oppTable", this_prof, cardDeptID);
		}	
	} else {
		console.log("UN CLICKED!");
		removeAllOfId(cardDeptID);
	}

	instructionText("oppTable");
}


function makeCard(id, prof, deptNameID) {

	// ------------------------------
	//  Start with the Card instance
	// ------------------------------
	var thisCard = document.createElement("div");
	thisCard.className = "dispCard";

	// ------------
	//   Top Line
	// ------------
	// First we start with the top line of the card:

	var topLine = document.createElement("div");
	topLine.className = "topLine";

	
	var profName = document.createElement("div");
	profName.className = 'profName';
	profName.innerHTML = "<h3>" + prof.name +"</h3>\
						<p><b>Currently Accepting?</b> " +
						prof.accepting + "</p>";

	var profDepts = document.createElement("div");
	profDepts.className = 'profDepts';
	var deptsReplaced = prof.depts.replace(/,/g, '<br>')
	deptsStr = '<p>' + deptsReplaced + '<br>'; //+ prof.depts + '<br>';

	// for (dept of prof.depts) {
	// 	deptsStr = deptsStr + dept + '<br>'
	// }

	// Add the department to the id tag so that the card can be removed
	// we not clicked
	thisCard.setAttribute('id', deptNameID);
	console.log(`id set to ${deptNameID}`)

	// Now also add the email
	deptsStr = deptsStr + "Email: <a href = \"mailto:" +
		prof.email + "\" >" + prof.email + "</p>";
	profDepts.innerHTML = deptsStr

	topLine.appendChild(profName);
	topLine.appendChild(profDepts);
	thisCard.appendChild(topLine);

	// ----------------
	//   Body of Card
	// ----------------

	// First, the Student Years
	var studentYears = document.createElement("p")
	studentYears.innerHTML = "<b>Student Years: </b>" + prof.studentYears;

	// Second, the Requirements
	var requirements = document.createElement("p")
	requirements.innerHTML = "<b>Requirements: </b>" + prof.requirements;

	// Third, Previous Students
	var students = document.createElement("p")
	var studStr = "<b>Previous Students:</b> " + prof.students;
	// for (stud of prof.students) {
	// 	studStr = studStr + ", " + stud
	// }
	// Ignore the first comma
	studStr = studStr.replace(',', '');
	students.innerHTML = studStr;

	// Fourth, Remote Opportunities (remove when back to normal)
	var remote = document.createElement("p")
	remote.innerHTML = "<b>Virtual Opportunities: </b>" 
									+ prof.remote;

	// Fifth, Current Opportunities
	var opportunities = document.createElement("p")
	opportunities.innerHTML =  "<b>Current Opportunities: </b>" 
									+ prof.opportunities;

	// Sixth, website
	var website = document.createElement("p")
	website.innerHTML = "<b>Website: </b>" + prof.website;

	// Seventh, website
	var lastupdate = document.createElement("p")
	lastupdate.innerHTML = "<b>Entry Most Recently Revised As Of: </b>" 
									+ prof.lastupdate;



	thisCard.appendChild(studentYears);
	thisCard.appendChild(requirements);
	thisCard.appendChild(students);
	thisCard.appendChild(remote);
	thisCard.appendChild(opportunities);
	thisCard.appendChild(website);
	thisCard.appendChild(lastupdate);

	document.getElementById(id).appendChild(thisCard);
}


function removeAllOfId(elementId) {
	// Removes all elements of a given id from the document
    var element = document.getElementById(elementId);
    var numPossibleChildren = element.parentNode.childElementCount;

    for (var i = 0; i < numPossibleChildren; i++) {
    	var element = document.getElementById(elementId);
    	if (element != null) {
    		element.parentNode.removeChild(element);
    	}	
    }
}


function instructionText(id) {
	var element = document.getElementById(id);

	var instructions = // "<br>Please click any department at LEFT!! <br> to begin viewing results.";
						"<br>Please click any department at left <br>" + 
						" to begin viewing results. <br><br>" + 
						" If no entries are listed, none of the professors <br>" +
						" from that department have replied <br>" + 
						"to our call for opportunities.";

	// console.log("Checking instructions");

	if (element === null) {
		// display instructions
		document.getElementById("opps").innerHTML = instructions;
	} else {
		var numChildren = element.childElementCount;
		// console.log(element);
		// console.log(numChildren);

		// If there are no cards there is only one child (the instructions).
		if (numChildren === 1) {
			// display instructions
			document.getElementById("opps").innerHTML = instructions;
		} else {
			// display nothing
			document.getElementById("opps").innerHTML = "";
			// Alternate Text: "Click any Caret at left to reset.";
		}
	}
}
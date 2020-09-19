console.log("hnlinks - content script loaded");

// document.body.onload = addElement;
// addElement();

const linksArray = createLinksList();
createLinksListElement(linksArray);

// create a function that extracts all external URLs from the page and displays them along with a button to go to the page location where this link appears
// and then creates a nice HTML element with all those links


function checkLink(lnk) {
    // TODO add more filters
    if (!(lnk.includes("news.ycombinator.com")) && !(lnk.includes("javascript:void")) && !(lnk.includes("ycombinator.com"))) {
        return true;
    }
}


function createLinksList() {

    let linksArray = [];
    let links = document.getElementsByTagName("a");
    for (let i = 0, max = links.length; i < max; i++) {
        // // linksArray.push(links[i].href);
        // try {
        //     console.log(links[i].closest('.comtr').id);
        // } catch (err) {} finally {}

        if (checkLink(links[i].href)) {

            try {
                idOfClosestParent = links[i].closest('.comtr').id;
                console.log(idOfClosestParent);
                linksArray.push({
                    "link": links[i].href,
                    "idOfClosestParent": idOfClosestParent
                });
            } catch (err) {} finally {}

        }
    }
    console.log(linksArray);
    return linksArray;
}

// createLinksList();



function createLinksListElement(linksArray) {
    const linksDiv = document.createElement("div");
    linksDiv.className = "halum";
    linksDiv.style.cssText =
        "position: fixed; top:0; right:0; font-family: sans-serif; font-size: 12px; overflow: auto; background-color: white; width: 350px; height: 200px; \
   border: 20px; padding: 20px";

    // and give it some content
    const newContent = document.createTextNode("Enjoy the list of filtered links that appear in this HN thread!");

    // add the text node to the newly created div
    linksDiv.appendChild(newContent);

    for (let i = 0; i < linksArray.length; i++) {
        const newP = document.createElement("p");

        var a = document.createElement('a');
        var linkText = document.createTextNode(linksArray[i]);
        a.appendChild(linkText);
        a.title = linksArray[i];
        a.href = linksArray[i];
        newP.appendChild(a);

        linksDiv.appendChild(newP);
    }
    document.body.appendChild(linksDiv);
}

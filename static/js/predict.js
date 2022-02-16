let model
let modelName = 'OCT_VGG16_final_tfjs'
let classes = OCT_CLASSES
let isLoaded = false
const fileTypes = ['jpg', 'jpeg', 'png'];
loadModel()

async function loadModel(){
    // Check if model is already loaded
    if(isLoaded == false){
        
        // Get current url
        const currUrl = $(location).attr('href')

        // Load model
        model = await tf.loadLayersModel(`${currUrl}tfjs-models/OCT_VGG16_final_tfjs/model.json`)
        isLoaded = true
    }
}

function populateTable(reset=true, classNames, probabilities){

    // Remove all rows in table
    $("table").find("tr:gt(0)").remove();

    // Get the number of classes
    let numClasses = Object.keys(classNames).length

    // Either reset table or populate with predictions
    for(let i=0; i<numClasses; i++){

        let prob
        if(reset==true){
            prob = 0
        } else if(probabilities[0] < 80){ // Show warning if predictions are too low
            $("#pred-msg").show() // Show warning
            $("table").hide() // Hide table
        } else {
            prob = probabilities[i]
        }
        
        // Add each prediction row to table
        $("table tbody").append(`
        <tr class="border-bottom">
        <td class="text-start fw-bold">${classNames[i]}</td>
        <td class="align-middle">
            <div class="d-flex align-items-center float-end">
                <div class="progress me-3 rounded-3" style="height: 6px; width: 100px;">
                    <div class="progress-bar rounded-pill" role="progressbar" style="width: ${prob}%;" aria-valuenow="${prob}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <div class="ms-2">${prob}%</div>
            </div>
        </td>
        </tr>`
        )
    }
}

// Load image
$("#image-selector").change(function () {

    let reader = new FileReader();
    // Load and update image
    reader.onload = function () {

        let dataURL = reader.result;
        console.log(dataURL.type)
        $("#selected-image").attr("src", dataURL);

        // Show table if its hidden and hide warning sign
        $("table").show()
        $("#pred-msg").hide()

        // Reset predictions when a new image is loaded
        populateTable(true, classes, [])
    }
    let file = $("#image-selector").prop("files")[0];
    reader.readAsDataURL(file);
}); 

$("#predict-button").on('click', async () => {

    // Start by showing a loading bar to let people know that something is loading
    $("#pred-pbar").show();
    // Hide warning sign if there is one
    $("#pred-msg").hide();

    // Get image
    let image = $("#selected-image").get(0)

    // Apply appropriate preprocessing to loaded image
    let tensor = preprocessImage(image, modelName)

    // Get predictions array
    let predictions = await model.predict(tensor).data()

    // Sort predictions
    let sortedPreds = Array.from(predictions)
        .map(function (p,i) {
            return {
                probability: (p*100).toFixed(1), // Convert probabilities to percentages
                className: classes[i]
            }
        })
        .sort(function (a,b) {
            return b.probability - a.probability
        })

    console.log(sortedPreds)

    // Separate probabilities and class names
    let probabilities = []
    let classNames = []
    sortedPreds.forEach(function(pred){
        classNames.push(pred.className)
        probabilities.push(pred.probability)
    })

    // Add each prediction to the table
    populateTable(false, classNames, probabilities)

    // Hide loading bar
    setTimeout(
        function() 
        {
            $("#pred-pbar").hide();
        }, 1000
    )
})

function preprocessImage(image, modelName) {
    // Resize and convert image to an array
    let tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([150,150])
        .toFloat()

    if (modelName === undefined) {
        return tensor.expandDims();
    }
    else if (modelName === 'OCT_VGG16_final_tfjs') {
        let offset = tf.scalar(255);
        return tensor.sub(offset)
            .div(offset)
            .expandDims();
    }
    else {
        throw new Error('Unknown model name');
    }
}


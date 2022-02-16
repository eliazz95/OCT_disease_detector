# OCT Disease Detector

This is a Node.js-based web application for detecting eye diseases. Transfer learning has been used to train the VGG16 model on roughly 84000 OCT images.
The images come from an open dataset taken from [Mendeley Data](https://data.mendeley.com/datasets/rscbjbr9sj/2)

## Install dependencies
To view all the dependencies and their versions, open `package.json`. To install all neccessary dependencies, run below command in the same folder as `package.json`.

```
$ npm install
```

## Start application
Run the following command in a terminal in the root folder to start the application:

```node
$ npm run start
```

## How to use the application
The application only supports grayscale OCT images and can only detect three disease and healthy eyes. The three disease are Choroidal Neovascularization (CNV), Diabetic macular edema (DME) and Drusen.

Upload the image using the upload function. Press the predict button to get predictions in the table on the right.

## Background
This is a master thesis project from Luleå University of Technology. It has been issued from a collaboration with Sahlgrenska University Hospital and the department of Ophthalmology in Gothenburg.

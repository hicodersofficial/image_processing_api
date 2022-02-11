# Image processing API

Resize & compress image from URL.
You can use this API to create different sizes of images.

```
$ npm install
```

## Starting App

```
$ node index.js
```

After starting navigate to http://localhost:5000

## **Query Parameter**

```
?q={quality <=100 (Default: 60)}
?s={image size}
?w={width}
?h={height}
?fit={contain, cover, fill, outside, inside}
?bg={Background color for cropped area}
```

```
http://localhost:5000/public/{filename}?q=90&s=200&fit=inside
```

## **Screenshots**

**Original** (1.5 MB) &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; **Compressed** (75 KB)

<div>
<img src="./docs/original-img.jpg" width="50%"><img src="./docs/original-img-com.jpg" width="50%">
</div>

**Original** (3 MB) &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; **Compressed** (12 KB)

<div>
<img src="./docs/original-img2.jpg"width="50%" ><img src="./docs/original-img1-com.jpg"width="50%">
</div>

<br />

## [Follow Instagram](https://www.instagram.com/hi.coders/)

## **Thank You! ❣️**

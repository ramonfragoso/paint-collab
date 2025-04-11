First, run the development server:

```bash
npm run dev
```

### How data is sent through web sockets:

```
{
    "x": 879,
    "y": 321,
    "isNewLine": false,
    "userId": "mq-4_c-CpDQCP7PAAAAV",
    "color": "#ffffff"
}
```

### How drawing history is structured
##### Each item is a path drawn by a user

```
[
  {
    "points": [
      { x: 1, y: 2 }, 
      { x: 3, y: 4 }
    ],
    "isNewLine": false,
    "userId": "mq-4_c-CpDQCP7PAAAAV",
    "color": "#ffffff"
  },
]
```

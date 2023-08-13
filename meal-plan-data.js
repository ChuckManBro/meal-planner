const dataInJson = `
[
 {
  "name": "Family Reunion Meal Plan",
  "startDate": "2023-08-05T02:29:55.134Z",
  "notes": "Everybody bring your own favorite cereal and milk.",
  "contributors": [
   {
    "id": "123",
    "name": "Mom & Dad",
    "color": "blue"
   },
   {
    "id": "124",
    "name": "Chuck & Missy",
    "color": "green"
   },
   {
    "id": "125",
    "name": "Becks",
    "color": "purple"
   },
   {
    "id": "126",
    "name": "Mousers",
    "color": "orange"
   }
  ],
  "days": [
   {
    "breakfast": {
     "food": "Bacon and Eggs",
     "contributor": "123"
    },
    "lunch": {
     "food": "fish",
     "contributor": "124"
    },
    "supper": {
     "food": "Hamburgers with fries",
     "contributor": "125"
    }
   },
   {
    "breakfast": {
     "food": "Cereal",
     "contributor": "124"
    },
    "lunch": {
     "food": "Chicken & Rice",
     "contributor": "125"
    },
    "supper": {
     "food": "horse",
     "contributor": "123"
    }
   },
   {
    "breakfast": {
     "food": "lion",
     "contributor": "125"
    },
    "lunch": {
     "food": "fish",
     "contributor": "123"
    },
    "supper": {
     "food": "Spagetti and Meatballs",
     "contributor": "126"
    }
   },
   {
    "breakfast": {
     "food": "self-serve",
     "contributor": ""
    },
    "lunch": {
     "food": "",
     "contributor": ""
    },
    "supper": {
     "food": "",
     "contributor": ""
    }
   },
   {
    "breakfast": {
     "food": "self-serve",
     "contributor": ""
    },
    "lunch": {
     "food": "",
     "contributor": ""
    },
    "supper": {
     "food": "",
     "contributor": ""
    }
   }
  ],
  "id": "1"
 },
 {
  "name": "Avondale",
  "startDate": "2023-09-15",
  "notes": "Vero esse aliquam autem occaecati. Quibusdam provident optio. Harum quisquam neque perspiciatis.",
  "contributors": [
   {
    "id": "123",
    "name": "Imani",
    "color": "orange"
   },
   {
    "id": "124",
    "name": "Camden",
    "color": "brown"
   },
   {
    "id": "125",
    "name": "Julian",
    "color": "gray"
   }
  ],
  "days": [
   {
    "breakfast": {
     "food": "horse",
     "contributor": "123"
    },
    "lunch": {
     "food": "dog",
     "contributor": "124"
    },
    "supper": {
     "food": "lion",
     "contributor": "125"
    }
   },
   {
    "breakfast": {
     "food": "snake",
     "contributor": "124"
    },
    "lunch": {
     "food": "fish",
     "contributor": "125"
    },
    "supper": {
     "food": "crocodilia",
     "contributor": "123"
    }
   },
   {
    "breakfast": {
     "food": "cetacean",
     "contributor": "125"
    },
    "lunch": {
     "food": "cat",
     "contributor": "123"
    },
    "supper": {
     "food": "lion",
     "contributor": "124"
    }
   },
   {
    "breakfast": {
     "food": "",
     "contributor": ""
    },
    "lunch": {
     "food": "",
     "contributor": ""
    },
    "supper": {
     "food": "",
     "contributor": ""
    }
   },
   {
    "breakfast": {
     "food": "",
     "contributor": ""
    },
    "lunch": {
     "food": "",
     "contributor": ""
    },
    "supper": {
     "food": "",
     "contributor": ""
    }
   }
  ],
  "id": "2"
 },
 {
  "name": "Morgan Hill",
  "startDate": "2023-12-30",
  "notes": "Animi ad quo repellendus sint nulla nihil commodi voluptas maxime. Est eaque illo porro ab. Voluptate enim eveniet et fugit optio. Eveniet exercitationem dignissimos vitae eaque ex quos optio consequatur velit. Eum iste aut fuga voluptatibus molestias vero odio ea eum. Minima perferendis cupiditate.",
  "contributors": [
   {
    "id": "123",
    "name": "Keshaun",
    "color": "red"
   },
   {
    "id": "124",
    "name": "Estrella",
    "color": "yellow"
   },
   {
    "id": "125",
    "name": "Sabrina",
    "color": "blue"
   }
  ],
  "days": [
   {
    "breakfast": {
     "food": "dog",
     "contributor": "123"
    },
    "lunch": {
     "food": "crocodilia",
     "contributor": "124"
    },
    "supper": {
     "food": "cetacean",
     "contributor": "125"
    }
   },
   {
    "breakfast": {
     "food": "cetacean",
     "contributor": "124"
    },
    "lunch": {
     "food": "cow",
     "contributor": "125"
    },
    "supper": {
     "food": "fish",
     "contributor": "123"
    }
   },
   {
    "breakfast": {
     "food": "rabbit",
     "contributor": "125"
    },
    "lunch": {
     "food": "rabbit",
     "contributor": "123"
    },
    "supper": {
     "food": "cat",
     "contributor": "124"
    }
   },
   {
    "breakfast": {
     "food": "",
     "contributor": ""
    },
    "lunch": {
     "food": "",
     "contributor": ""
    },
    "supper": {
     "food": "",
     "contributor": ""
    }
   },
   {
    "breakfast": {
     "food": "",
     "contributor": ""
    },
    "lunch": {
     "food": "",
     "contributor": ""
    },
    "supper": {
     "food": "",
     "contributor": ""
    }
   }
  ],
  "id": "3"
 },
 {
  "name": "My Blank Meal Plan",
  "startDate": "2023-08-12",
  "notes": "",
  "contributors": [],
  "days": [
   {
    "breakfast": {
     "food": "",
     "contributor": ""
    },
    "lunch": {
     "food": "",
     "contributor": ""
    },
    "supper": {
     "food": "",
     "contributor": ""
    }
   },
   {
    "breakfast": {
     "food": "",
     "contributor": ""
    },
    "lunch": {
     "food": "",
     "contributor": ""
    },
    "supper": {
     "food": "",
     "contributor": ""
    }
   },
   {
    "breakfast": {
     "food": "",
     "contributor": ""
    },
    "lunch": {
     "food": "",
     "contributor": ""
    },
    "supper": {
     "food": "",
     "contributor": ""
    }
   }
  ],
  "id": "4"
 }
]
`;

export const mealPlans = JSON.parse(dataInJson);

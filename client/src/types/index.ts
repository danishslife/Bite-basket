export interface User {
  _id: string;
  name: string;
  email: string;
  bookmarks: Recipe[];
}

export interface Recipe {
  _id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  mealType: string[];
  image: string;
  rating: number;
  postedBy: {
    _id: string;
    name: string;
    email: string;
  };
  isSeeded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

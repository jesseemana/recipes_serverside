import { User } from './user.model';
import { Recipe } from './recipe.model';
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';

export class Bookmark {
  @prop({ ref: () => User })
  user: Ref<User>;

  @prop({ ref: () => Recipe })
  recipe: Ref<Recipe>;

  @prop({ default: true})
  bookmarked: boolean;
}

const BookmarksModel = getModelForClass(Bookmark, {
  schemaOptions: {
    timestamps: true,
  }
});

export default BookmarksModel;

import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema()
export class Project {
  _id?: string;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  director: string;

  @Prop({ required: true })
  dop: string;

  @Prop({ required: true })
  category: string;

  img: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

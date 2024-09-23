import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Model } from 'mongoose';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {}

  // CREATE a new project
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const newProject = new this.projectModel(createProjectDto);

    return await newProject.save();
  }

  // READ all projects
  async findAll(): Promise<Project[]> {
    return await this.projectModel.find().exec();
  }

  async findOne(id: number): Promise<Project> {
    const projectExists = await this.projectModel.findById(id);

    if (!projectExists) {
      throw new Error('Proyecto no encontrado');
    }
    return projectExists;
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    console.log(id);
    console.log(updateProjectDto);
    return `This action updates a #${id} project`;
  }

  remove(id: string) {
    return `This action removes a #${id} project`;
  }
}

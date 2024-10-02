import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Model } from 'mongoose';
import { Project } from './entities/project.entity';
import { NotFoundException } from '@nestjs/common';

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

  // READ a project by id
  async findOne(id: string): Promise<Project> {
    const projectExists = await this.projectModel.findById(id);

    if (!projectExists) {
      throw new Error('Proyecto no encontrado');
    }
    return projectExists;
  }

  // UPDATE a project by id
  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    try {
      const updatedProject = await this.projectModel
        .findByIdAndUpdate(id, updateProjectDto, {
          new: true,
        })
        .exec();

      if (!updatedProject) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      return updatedProject;
    } catch (error) {
      // Manejo de errores adicionales si es necesario
      throw new BadRequestException(
        'An error occurred while updating the project',
        error.message,
      );
    }
  }

  // DELETE a project by id
  async remove(id: string) {
    const projectExists = await this.projectModel.findById(id);

    if (!projectExists) {
      throw new Error('Proyecto no encontrado');
    }
    return await this.projectModel.findByIdAndDelete(id).exec();
  }

  // UPLOAD an image to a project
  async uploadImage(body: any) {
    const { id, img } = body;
    const projectExists = await this.projectModel.findById(id);

    if (!projectExists) {
      throw new Error('Proyecto no encontrado');
    }

    return await this.projectModel.findByIdAndUpdate(
      id,
      { img },
      { new: true },
    );
  }
}

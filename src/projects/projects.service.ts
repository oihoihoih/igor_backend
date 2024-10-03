import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {}

  async createProject(
    createProjectDto: CreateProjectDto,
    file: Express.Multer.File,
  ): Promise<Project> {
    const createdProject = new this.projectModel({
      ...createProjectDto,
      img: file ? `/uploads/${file.filename}` : null,
    });
    return createdProject.save();
  }

  async findAll(): Promise<Project[]> {
    return await this.projectModel.find().exec();
  }

  async findOne(id: string): Promise<Project> {
    const projectExists = await this.projectModel.findById(id);
    if (!projectExists) {
      throw new NotFoundException('Proyecto no encontrado');
    }
    return projectExists;
  }

  async updateProject(
    id: string,
    updateProjectDto: UpdateProjectDto,
    file?: Express.Multer.File,
  ) {
    const project = await this.projectModel.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Si se subió una imagen, actualiza la ruta de la imagen
    if (file) {
      const imagePath = `/uploads/${file.filename}`; // Asume que guardas las imágenes en una carpeta 'uploads'
      updateProjectDto.img = imagePath;
    }

    // Actualiza los demás campos del proyecto
    await this.projectModel.findByIdAndUpdate(id, updateProjectDto, {
      new: true,
    });

    return this.projectModel.findById(id); // Devuelve el proyecto actualizado
  }

  async remove(id: string) {
    const projectExists = await this.projectModel.findById(id);
    if (!projectExists) {
      throw new NotFoundException('Proyecto no encontrado');
    }
    return await this.projectModel.findByIdAndDelete(id).exec();
  }

  async updateImage(id: string, imgPath: string): Promise<Project> {
    const project = await this.projectModel.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    project.img = imgPath;
    return await project.save();
  }
}

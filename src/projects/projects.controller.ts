import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipeBuilder,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Create project
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  // Get all projects
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  // Get project by id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  // Update project by id
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  // Delete project by id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  // Add image to project
  // @Post('images/upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: '../igor_pf/src/assets/uploads',
  //       filename: (req, file, cb) => {
  //         cb(null, file.originalname);
  //       },
  //     }),
  //   }),
  // )
  // uploadFile(
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
  //       .addMaxSizeValidator({ maxSize: 1024 * 1024 * 4 })
  //       .build({
  //         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //         fileIsRequired: false,
  //       }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   console.log(file);
  // }

  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Carpeta donde se guardarán las imágenes
        filename: (req, file, cb) => {
          // Puedes personalizar el nombre de la imagen para que sea único
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = file.originalname.split('.').pop(); // Obtener extensión
          const filename = `${file.fieldname}-${uniqueSuffix}.${extension}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }), // Max 4MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Actualizar el proyecto con la ruta de la imagen
    const imgPath = `/uploads/${file.filename}`; // Ruta relativa
    return this.projectsService.updateImage(id, imgPath);
  }
}

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination-pokemon.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) { }


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = this.configService.get<number>('defaultLimit'), offset = 0 } = paginationDto
    return await this.pokemonModel.find().limit(limit).skip(offset).sort({
      no: 1
    }).select('-__v')
  }

  async findOne(searchTerm: string) {
    let pokemon: Pokemon;
    if (!isNaN(Number(searchTerm))) {
      pokemon = await this.pokemonModel.findOne({ no: searchTerm });
    }

    //Mongo Id
    if (!pokemon && isValidObjectId(searchTerm)) {
      pokemon = await this.pokemonModel.findById(searchTerm);
    }

    // By name
    if (!pokemon) {
      const regex = new RegExp(searchTerm, 'i');
      pokemon = await this.pokemonModel.findOne({ name: regex });
    }


    if (!pokemon) {
      throw new NotFoundException(`Pokemon with ${searchTerm} not found`)
    }

    return pokemon;


  }

  async update(searchTerm: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(searchTerm);
      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()

        await pokemon.updateOne(updatePokemonDto, { new: true });

        return { ...pokemon.toJSON(), ...updatePokemonDto };
      }
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    // const result = await this.pokemonModel.findByIdAndDelete(id)
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id ${id} not found`)
    }

    return { message: 'Pokemon deleted successfully' }
  }

  handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon with name ${JSON.stringify(error.keyValue)} already exists`)
    }
    throw new InternalServerErrorException(`Resourse don't work - check logs`)
  }
}

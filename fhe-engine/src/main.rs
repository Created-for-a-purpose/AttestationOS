mod utils;
use actix_web::{ get, post, web, App, HttpServer, HttpResponse, Error };
use std::fs::File;
use std::io::Write;
use tfhe::prelude::*;
use tfhe::{ ClientKey, FheUint32 };
use utils::{ gen_keys, load_key };

#[post("/vote")]
async fn vote(encrypted_vote: web::Json<Vec<u8>>) -> Result<HttpResponse, Error> {
    load_key().unwrap();
    let evote: FheUint32 = bincode::deserialize(&encrypted_vote).unwrap();

    let evotes: FheUint32 = bincode
        ::deserialize_from(File::open("./encrypted_data.bin").unwrap())
        .unwrap();
    let result = &evote + &evotes;
    let serialized = bincode::serialize(&result).unwrap();
    let mut file = File::create("./encrypted_data.bin").unwrap();
    file.write_all(&serialized).unwrap();

    Ok(HttpResponse::Ok().body("Vote added"))
}

#[get("/result")]
async fn check_result() -> Result<web::Json<u32>, Error> {
    let ck: ClientKey = bincode::deserialize_from(File::open("./cks.bin").unwrap()).unwrap();
    let result: FheUint32 = bincode::deserialize_from(File::open("./encrypted_data.bin").unwrap()).unwrap();
    let result_clear: u32 = result.decrypt(&ck);
    Ok(web::Json(result_clear))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    gen_keys().unwrap();
    HttpServer::new(|| { App::new().service(vote).service(check_result) })
        .bind(("127.0.0.1", 8080))?
        .run().await
}
mod utils;
use actix_cors::Cors;
use actix_web::{ get, post, web, App, HttpServer, HttpResponse, Error };
use std::fs::File;
use std::io::Write;
use tfhe::prelude::*;
use tfhe::{ ClientKey, FheUint32, CompactPublicKey };
use utils::{ gen_keys, load_key };

#[post("/vote")]
async fn vote(encrypted_vote: web::Json<Vec<u8>>) -> Result<HttpResponse, Error> {
    load_key().unwrap();
    let evote: FheUint32 = bincode::deserialize(&encrypted_vote).unwrap();
    println!("Received vote");
    let evotes: FheUint32 = bincode
        ::deserialize_from(File::open("./encrypted_data.bin").unwrap())
        .unwrap();
    let result = &evote + &evotes;
    let serialized = bincode::serialize(&result).unwrap();
    let mut file = File::create("./encrypted_data.bin").unwrap();
    file.write_all(&serialized).unwrap();
    println!("Vote added");

    Ok(HttpResponse::Ok().body("Vote added"))
}

#[get("/result")]
async fn check_result() -> Result<web::Json<u32>, Error> {
    let ck: ClientKey = bincode::deserialize_from(File::open("./cks.bin").unwrap()).unwrap();
    let result: FheUint32 = bincode
        ::deserialize_from(File::open("./encrypted_data.bin").unwrap())
        .unwrap();
    let result_clear: u32 = result.decrypt(&ck);
    Ok(web::Json(result_clear))
}

#[get("/pkey")]
async fn get_public_key() -> Result<web::Json<Vec<u8>>, Error> {
    let file = File::open("./pks.bin").unwrap();
    let public_key: CompactPublicKey = bincode::deserialize_from(file).unwrap();
    let bytes: Vec<u8> = bincode::serialize(&public_key).unwrap();
    Ok(web::Json(bytes))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    gen_keys().unwrap();
    HttpServer::new(|| { App::new()
        .wrap(
            Cors::default()
                .allowed_origin("http://localhost:5173")
                .allowed_methods(vec!["GET", "POST"])
                .allowed_headers(vec![actix_web::http::header::AUTHORIZATION, actix_web::http::header::ACCEPT])
                .allowed_header(actix_web::http::header::CONTENT_TYPE)
                .max_age(3600),
        )
        .app_data(web::JsonConfig::default().limit(10_485_760))
        .service(vote).service(check_result).service(get_public_key) })
        .bind(("127.0.0.1", 8080))?
        .run().await
}
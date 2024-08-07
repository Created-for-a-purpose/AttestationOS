use std::fs::File;
use std::io::Write;
use tfhe::{ ConfigBuilder, CompactPublicKey, CompactCiphertextList, FheUint32, ServerKey, generate_keys, set_server_key };

pub fn gen_keys() -> Result<(), Box<bincode::ErrorKind>> {
    let config = ConfigBuilder::default().build();
    let (client_key, server_key) = generate_keys(config);
    let serialized_key = bincode::serialize(&client_key)?;
    let mut file = File::create("./cks.bin")?;
    file.write_all(&serialized_key)?;

    let public_key = CompactPublicKey::new(&client_key);
    let serialized_key = bincode::serialize(&public_key)?;
    let mut file = File::create("./pks.bin")?;
    file.write_all(&serialized_key)?;

    let compact_list = CompactCiphertextList::builder(&public_key).push(0u32).build();
    let expanded = compact_list.expand().unwrap();
    let a: FheUint32 = expanded.get(0).unwrap().unwrap();
    let serialized = bincode::serialize(&a)?;
    let mut file = File::create("./encrypted_data.bin")?;
    file.write_all(&serialized)?;

    let serialized_key = bincode::serialize(&server_key)?;
    let mut file = File::create("./sks.bin")?;
    file.write_all(&serialized_key)?;
    Ok(())
}

pub fn load_key() -> Result<(), Box<bincode::ErrorKind>> {
    let file = File::open("./sks.bin")?;
    let server_key: ServerKey = bincode::deserialize_from(file)?;
    set_server_key(server_key);
    Ok(())
}